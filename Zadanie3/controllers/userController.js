import { User } from '../models/user.js'; // Zakładając, że masz odpowiednią ścieżkę do modelu

export const getUsernameById = async (userId) => {
    try {
        // Szukamy użytkownika na podstawie jego ID
        const user = await User.findById(userId);

        // Jeśli użytkownik nie istnieje, rzucamy wyjątek
        if (!user) {
            throw new Error('User not found');
        }

        // Zwracamy username
        return user.username;
    } catch (error) {
        console.error(error.message);
        throw new Error('Error finding user by ID');
    }
};
