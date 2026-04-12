import mongoose from 'mongoose';

interface LevelProgress {
	theory?: boolean;
	quizzes?: boolean[]; // Сделали необязательным
	final?: boolean;
}

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ['student', 'teacher'], default: 'student' },
	// Используем обычный Mixed тип или четкую структуру, но без strict-проверок
	progress: {
		type: Map,
		of: {
			theory: { type: Boolean, default: false },
			quizzes: { type: [Boolean], default: [] },
			final: { type: Boolean, default: false }
		},
		default: {}
	}
});

export const User = mongoose.model('User', userSchema);