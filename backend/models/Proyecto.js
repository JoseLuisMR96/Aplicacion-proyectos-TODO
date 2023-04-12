import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    descripcion: {
        type: String,
        trim: true,
        required: true,
    },
    fechaEntrega: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    cliente: {
        type: String,
        trim: true,
        required: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        red: "Usuario",
    },
    colaboradores: [{
        type: mongoose.Schema.Types.ObjectId,
        red: "Usuario",
    }, ],

}, {
    timestamps: true,
});
const Proyecto = mongoose.model("Proyecto", proyectosSchema);

export default Proyecto;