const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const appointmentsFilePath = path.join(__dirname, "data", "appointments.json");

app.use(cors());
app.use(express.json());

const services = [
    {
        id: 1,
        name: "Corte masculino",
        price: 25,
        duration: "40 min",
    },
    {
        id: 2,
        name: "Barba completa",
        price: 15,
        duration: "30min",
    },
    {
        id: 3,
        name: "Corte + Barba",
        price: 35,
        duration: "1h 10min",
    },
    {
        id: 4,
        name: "Sobrancelhas",
        price: 15,
        duration: "15min",
    },
];

const barbers = [

    {
        id: 1,
        name: "Alex",
        specialty: "Degradê e cortes modernos",
        rating: 4.9,
    },
    {
        id: 2,
        name: "Fideles",
        specialty: "Degradê e cortes modernos",
        rating: 4.9,
    },
];

function getAppointments() {
    const data = fs.readFileSync(appointmentsFilePath, "utf-8");
    return JSON.parse(data);
}

function saveAppointments(appointments) {
    fs.writeFileSync(appointmentsFilePath, JSON.stringify(appointments, null, 2));
}

app.get("/", (req, res) => {
    res.send("API BarberHub funcionando!");
});

app.get("/api/services", (req, res) => {
    res.json(services);
});

app.get("/api/barbers", (req, res) => {
    res.json(barbers);
});

app.get("/api/appointments", (req, res) => {
    const appointments = getAppointments();

    res.json(appointments);
});

app.post("/api/appointments", (req, res) => {
    const{clientName, phone, serviceId, barberId, date, time} = req.body;
    const appointments = getAppointments();

    if(!clientName || !phone || !serviceId || !barberId || !date || !time){
        return res.status(400).json({
            message: "Preencha todos os campos obrigatórios"
        });
    }

    const alreadyBooked = appointments.find((appointment) => {
        return(
            appointment.barberId === barberId &&
            appointment.date === date &&
            appointment.time === time 
        );
    });

    if(alreadyBooked){
        return res.status(400).json({
            message: "Esse barbeiro já tem um agendamento nesse horário.",
        });
    }

    const newAppointment = {
        id: appointments.length + 1,
        clientName,
        phone,
        serviceId,
        barberId,
        date,
        time,
        status: "agendado",
    };

    appointments.push(newAppointment);
    saveAppointments(appointments);

    res.status(201).json(newAppointment);
});

app.patch("/api/appointments/:id/status", (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    const allowedStatus = ["agendado", "confirmado", "concluido", "cancelado"];

    if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message: "Status inválido.",
        });
    }

    const appointments = getAppointments();

    const appointment = appointments.find((appointment) => {
        return appointment.id === Number(id);
    });

    if(!appointment){
        return res.status(404).json({
            message: "Agendamento não encontrado.",
        });
    }

    appointment.status = status;
    saveAppointments(appointments);
    res.json(appointment);
})

app.delete("/api/appointments/:id", (req, res) =>{
    const {id} = req.params;
    const appointments = getAppointments();

    const appointmentExists = appointments.some((appointment) =>{
        return appointment.id === Number(id);
    });

    if(!appointmentExists){
        return res.status(404).json({
            message: "Agendamento não encontrado.",
        });
    }

    const updatedAppointments = appointments.filter((appointment) =>{
        return appointment.id !== Number(id);
    });

    saveAppointments(updatedAppointments);
    res.json({
        messagem: "Agendamento deletado com sucesso."
    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

