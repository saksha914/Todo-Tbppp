import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    color: {
        type: String,
        default: '#000000'
    },
    icon: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['owner', 'admin', 'member'],
            default: 'member'
        }
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    labels: [{
        name: String,
    }],
    settings: {
        defaultView: {
            type: String,
            enum: ['list', 'board', 'calendar', 'timeline'],
            default: 'list'
        },
        taskOrder: {
            type: String,
            enum: ['manual', 'dueDate', 'priority', 'createdAt'],
            default: 'manual'
        }
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better query performance
projectSchema.index({ createdBy: 1, isArchived: 1 });
projectSchema.index({ 'members.user': 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project; 