const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.post("/chat", async( req, res ) => {
    

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ reply: "Mensaje vacío recibido." });
        }

        const respuestas = {
            habilidades: [
                "Tiene experiencia en React, Node.js y bases de datos.",
                "Sabe programar en JavaScript y tiene conocimientos de Python.",
                "Conoce HTML, CSS y Bootstrap.",
                "Sabe usar Git y tiene experiencia con GitHub.",
                "Sabe usar Tailwind, Express y MongoDB.",
                "Se destaca en frontend con React y diseño responsivo."
            ],
            proyectos: [
                "Puedes ver algunos de sus proyectos web en la pestaña 'Proyectos'.",
                "El ha hecho apps como este Portfolio con React y backends con Express.",
                "Además sigue aprendiendo y mejorando sus habilidades."
            ],
            saludo: [
                "¡Hola! ¿En qué te puedo ayudar?",
                "¡Buenas! Estoy acá para responderte.",
                "¡Hola, preguntame lo que quieras 😄 de Enrique!"
            ],
            desconocido: [
                "Soy un chatbot simulado, pronto usaré OpenAI.",
                "No entendí eso, ¿podés repetirlo?",
                "Aún estoy aprendiendo, preguntame sobre mis proyectos."
            ]
        };

        const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const obtenerRespuesta = (mensajeUsuario) => {
            const msg = mensajeUsuario.toLowerCase();

            if (msg.includes("habilidad")) return random(respuestas.habilidades);
            if (msg.includes("proyecto")) return random(respuestas.proyectos);
            if (msg.includes("hola") || msg.includes("buenas")) return random(respuestas.saludo);

            return random(respuestas.desconocido);
        }

        const reply = obtenerRespuesta(message);
        res.json({ reply });

    } catch ( error ) {
        console.log("Error en /chat:", error);
        res.status(500).json({ reply: "Error al procesar tu mensaje." });
    }

});

app.post("/contact", async(req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.DESTINATION_EMAIL,
        subject: "Mensaje desde formulario de contacto",
        text: `Nombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send("Mensaje enviado correctamente.");
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error al enviar el mensaje");
    }
});


app.listen( 3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
} );