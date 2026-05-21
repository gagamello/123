const defaultSlots = [
  { id: "2026-06-12 17:00", title: "12.06.2026, 17:00 • Makrama", capacity: 5 },
  { id: "2026-06-19 18:00", title: "19.06.2026, 18:00 • Biżuteria handmade", capacity: 6 },
  { id: "2026-06-26 17:30", title: "26.06.2026, 17:30 • Świece sojowe", capacity: 4 }
];

const state = {
  slots: JSON.parse(localStorage.getItem("handmade_slots") || "null") || defaultSlots,
  signups: JSON.parse(localStorage.getItem("handmade_signups") || "[]")
};

const slotsList = document.getElementById("slotsList");
const slotSelect = document.getElementById("slotSelect");
const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");
const adminRows = document.getElementById("adminRows");
const clearDataButton = document.getElementById("clearData");

const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function save() {
  localStorage.setItem("handmade_slots", JSON.stringify(state.slots));
  localStorage.setItem("handmade_signups", JSON.stringify(state.signups));
}

function freePlaces(slotId) {
  const slot = state.slots.find(s => s.id === slotId);
  const taken = state.signups.filter(s => s.slotId === slotId).length;
  return Math.max(slot.capacity - taken, 0);
}

function renderSlots() {
  slotsList.innerHTML = "";
  slotSelect.innerHTML = "";

  state.slots.forEach(slot => {
    const free = freePlaces(slot.id);

    const li = document.createElement("li");
    li.textContent = `${slot.title} — wolne miejsca: ${free}`;
    slotsList.appendChild(li);

    const option = document.createElement("option");
    option.value = slot.id;
    option.disabled = free === 0;
    option.textContent = free === 0 ? `${slot.title} (brak miejsc)` : `${slot.title} (${free} wolnych)`;
    slotSelect.appendChild(option);
  });
}

function renderAdmin() {
  adminRows.innerHTML = "";
  state.signups.forEach(entry => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.email}<br>${entry.phone}</td>
      <td>${entry.slotTitle}</td>
      <td>${entry.source}</td>
    `;
    adminRows.appendChild(tr);
  });
}

function addSignup(data) {
  const free = freePlaces(data.slotId);
  if (free <= 0) return { ok: false, message: "Brak miejsc w tym terminie." };

  state.signups.push(data);
  save();
  renderSlots();
  renderAdmin();
  return { ok: true, message: `Super! ${data.name}, jesteś zapisana/y na: ${data.slotTitle}` };
}

signupForm.addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(signupForm);
  const slotId = fd.get("slot");
  const slot = state.slots.find(s => s.id === slotId);

  const result = addSignup({
    name: fd.get("name"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    slotId,
    slotTitle: slot.title,
    source: "Formularz"
  });

  signupMessage.textContent = result.message;
  if (result.ok) signupForm.reset();
});

function botSpeak(text) {
  const p = document.createElement("p");
  p.className = "msg bot";
  p.textContent = `Bot: ${text}`;
  chatWindow.appendChild(p);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function userSpeak(text) {
  const p = document.createElement("p");
  p.className = "msg user";
  p.textContent = `Ty: ${text}`;
  chatWindow.appendChild(p);
}

function botHandle(input) {
  const text = input.toLowerCase();

  if (text.includes("wolne") || text.includes("termin")) {
    const summary = state.slots
      .map(s => `${s.title} (${freePlaces(s.id)} wolnych)`)
      .join("; ");
    return `Aktualne miejsca: ${summary}`;
  }

  if (text.includes("zapis") || text.includes("chcę")) {
    const candidate = state.slots.find(s => text.includes(s.id.slice(5, 10).replace("-", ".")) || text.includes(s.title.slice(0, 5)));
    const slot = candidate || state.slots.find(s => freePlaces(s.id) > 0);

    if (!slot) return "Niestety wszystkie terminy są pełne.";

    const fakeName = "Uczestnik z czatu";
    const result = addSignup({
      name: fakeName,
      email: "chat@lokalnie.pl",
      phone: "000-000-000",
      slotId: slot.id,
      slotTitle: slot.title,
      source: "Bot"
    });

    return result.ok
      ? `Zapisałem Cię wstępnie na ${slot.title}. Organizator skontaktuje się, by potwierdzić dane.`
      : result.message;
  }

  return "Mogę: 1) pokazać wolne terminy, 2) zrobić szybki zapis na najbliższe szkolenie.";
}

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;

  userSpeak(value);
  const answer = botHandle(value);
  botSpeak(answer);
  chatInput.value = "";
});

clearDataButton.addEventListener("click", () => {
  if (!confirm("Na pewno wyczyścić wszystkie zapisy?")) return;
  state.signups = [];
  save();
  renderSlots();
  renderAdmin();
  botSpeak("Panel admina: wszystkie zapisy zostały usunięte.");
});

renderSlots();
renderAdmin();
botSpeak("Cześć! Napisz „wolne terminy” albo „chcę się zapisać”.");
