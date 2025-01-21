<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import Papa from 'papaparse';

const authStore = useAuthStore();
const file = ref(null);
const error = ref('');
const isSubmitting = ref(false);

const toast = useToast();

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  file.value = selectedFile;
  validateFile(selectedFile);
};

const validateFile = (selectedFile) => {
  const allowedTypes = ['text/csv', 'application/json'];
  if (!allowedTypes.includes(selectedFile.type)) {
    error.value = 'Dozwolony typ pliku to CSV lub JSON.';
    file.value = null;
  } else {
    error.value = '';
  }
};

const parseFile = async (selectedFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (selectedFile.type === 'application/json') {
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          resolve(data);
        } catch (err) {
          reject(new Error('Nieprawidłowy format JSON.'));
        }
      };
    } else if (selectedFile.type === 'text/csv') {
      reader.onload = () => {
        Papa.parse(reader.result, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            resolve(results.data);
          },
          error: (err) => {
            reject(new Error('Nieprawidłowy format CSV.'));
          },
        });
      };
    }

    reader.onerror = () => {
      reject(new Error('Nie udało się odczytać pliku.'));
    };

    reader.readAsText(selectedFile);
  });
};

const handleFileSubmit = async () => {
  if (!file.value) {
    error.value = 'Proszę wybrać plik.';
    return;
  }

  try {
    isSubmitting.value = true;

    const data = await parseFile(file.value);
    if (!Array.isArray(data)) {
      throw new Error('Nieprawidłowy format danych. Oczekiwano tablicy obiektów.');
    }

    for (const item of data) {
      if (
          !item.name ||
          !item.description ||
          !item.category ||
          isNaN(item.unitPrice) ||
          isNaN(item.unitWeight)
      ) {
        throw new Error('Dane w pliku są nieprawidłowe.');
      }
    }

    const formData = new FormData();
    formData.append('file', file.value);

    await axios.post('/api/init', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    toast.success('Baza danych została pomyślnie zainicjalizowana.');
  } catch (err) {
    error.value = err?.response?.data?.message || err?.response?.data?.error || err?.message;
    console.error(err);
    toast.error('Wystąpił błąd podczas przetwarzania pliku.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div v-if="authStore.isEmployee">
    <h2>Inicjalizacja bazy danych</h2>

    <form @submit.prevent="handleFileSubmit" enctype="multipart/form-data">
      <div class="mb-3">
        <label for="file" class="form-label">Wybierz plik do załadowania:</label>
        <input
            type="file"
            class="form-control"
            id="file"
            ref="fileInput"
            @change="handleFileChange"
            required
        />
        <div v-if="error" class="text-danger">{{ error }}</div>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Przesyłanie...' : 'Załaduj plik' }}
      </button>
    </form>
  </div>
  <div v-else>
    <p>Brak dostępu do tej strony. Tylko pracownicy mogą inicjalizować bazę danych.</p>
  </div>
</template>

<style scoped>

</style>