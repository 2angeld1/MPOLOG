import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    title: String;
    body: String;
    type: String; // 'conteo', 'evento', 'alerta'
    isRead: boolean;
    usuario?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, required: true, enum: ['conteo', 'evento', 'alerta'], default: 'alerta' },
    isRead: { type: Boolean, default: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
