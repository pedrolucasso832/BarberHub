document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    console.log(menuToggle);
    console.log(navMenu);

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    const API_URL = "http://localhost:3000/api";

    const servicesList = document.getElementById("servicesList");
    const barbersList = document.getElementById("barbersList");

    const serviceSelect = document.getElementById("serviceSelect");
    const barberSelect = document.getElementById("barberSelect");

    async function loadServices() {
        const response = await fetch(`${API_URL}/services`);
        const services = await response.json();

        servicesList.innerHTML = "";

        services.forEach((service) => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h3>${service.name}</h3>
                <p>Preço: R$ ${service.price}</p>
                <p>Duração: ${service.duration}</p>
            `;

            servicesList.appendChild(card);

            const option = document.createElement("option");
            option.value = service.id;
            option.textContent = `${service.name} - R$ ${service.price}`;

            serviceSelect.appendChild(option);
        });
    }

    async function loadBarbers() {
        const response = await fetch(`${API_URL}/barbers`);
        const barbers = await response.json();

        barbersList.innerHTML = "";

        barbers.forEach((barber) => {
            const card = document.createElement("div");
            card.classList.add("card")

            card.innerHTML = `
                <h3>${barber.name}</h3>
                <p>${barber.specialty}</p>
                <p>Avaliação ${barber.rating}</p>
            `;

            barbersList.appendChild(card);

            const option = document.createElement("option");
            option.value = barber.id;
            option.textContent = barber.name;

            barberSelect.appendChild(option);
        });
    }

    const bookingForm = document.getElementById("bookingForm");
    const bookingMessage = document.getElementById("bookingMessage");

    bookingForm.addEventListener("submit", async (Event) => {
        Event.preventDefault();

        const formData = new FormData(bookingForm);

        const appointment = {
            clientName: formData.get("clientName"),
            phone: formData.get("phone"),
            serviceId: Number(formData.get("serviceId")),
            barberId: Number(formData.get("barberId")),
            date: formData.get("date"),
            time: formData.get("time"),
        };

        try {
            const response = await fetch(`${API_URL}/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(appointment),
            });

            const data = await response.json();

            if (!response.ok) {
                bookingMessage.textContent = data.message || "Erro ao criar agendamento.";
                bookingMessage.className = "error";
                return;
            }
            bookingMessage.textContent = "Agendamento criado com sucesso!";
            bookingMessage.className = "success";

            bookingForm.reset();
        } catch (error) {
            bookingMessage.textContent = "Não foi possível conectar ao servidor.";
            bookingMessage.className = "error";
        }
    });

    loadServices();
    loadBarbers();
});





