const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

if (!isBrowser) {
  console.log('Ta aplikacja działa w przeglądarce. Otwórz plik index.html.');
}

const DAY_MINUTES = 24 * 60;
const UNIT_MINUTES = 15;
const PIXELS_PER_HOUR = 40;
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;
const LANE_GAP = 8;

const palette = ['#66d9ff', '#8ce99a', '#ffd166', '#c19bff', '#ff9f9f', '#5ff2b7'];

const tasks = [
  { id: crypto.randomUUID(), name: 'Poranna rutyna', start: '07:00', duration: 45 },
  { id: crypto.randomUUID(), name: 'Praca głęboka', start: '09:00', duration: 180 },
  { id: crypto.randomUUID(), name: 'Spacer', start: '13:00', duration: 30 },
  { id: crypto.randomUUID(), name: 'Maile i administracja', start: '14:00', duration: 60 }
];

function minutesFromTime(value) {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}

function timeFromMinutes(value) {
  const clamped = Math.max(0, Math.min(DAY_MINUTES - UNIT_MINUTES, value));
  const hours = Math.floor(clamped / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (clamped % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function buildScheduleMeta() {
  const usedMinutes = tasks.reduce((sum, task) => sum + task.duration, 0);
  const freeMinutes = Math.max(DAY_MINUTES - usedMinutes, 0);
  return { usedMinutes, freeMinutes };
}

function doTasksOverlap(a, b) {
  const aStart = minutesFromTime(a.start);
  const aEnd = aStart + a.duration;
  const bStart = minutesFromTime(b.start);
  const bEnd = bStart + b.duration;
  return aStart < bEnd && bStart < aEnd;
}

function computeLanes(sortedTasks) {
  const lanes = [];

  sortedTasks.forEach((task) => {
    let laneIndex = 0;
    while (true) {
      if (!lanes[laneIndex]) {
        lanes[laneIndex] = [task];
        task.lane = laneIndex;
        break;
      }

      const hasOverlap = lanes[laneIndex].some((existing) => doTasksOverlap(existing, task));
      if (!hasOverlap) {
        lanes[laneIndex].push(task);
        task.lane = laneIndex;
        break;
      }
      laneIndex += 1;
    }
  });

  return lanes.length;
}

function renderHours(hoursCol) {
  hoursCol.innerHTML = '';
  for (let h = 0; h <= 24; h += 1) {
    const marker = document.createElement('div');
    marker.className = 'hour-label';
    marker.style.top = `${h * PIXELS_PER_HOUR}px`;
    marker.textContent = `${h.toString().padStart(2, '0')}:00`;
    hoursCol.appendChild(marker);
  }
}

function render() {
  if (!isBrowser) return;

  const summary = document.getElementById('summary');
  const timeline = document.getElementById('timeline');
  const taskList = document.getElementById('task-list');
  const hoursCol = document.getElementById('hours');

  if (!summary || !timeline || !taskList || !hoursCol) return;

  const { usedMinutes, freeMinutes } = buildScheduleMeta();
  summary.textContent = `Zaplanowano ${formatDuration(usedMinutes)} z 24h. Wolne: ${formatDuration(
    freeMinutes
  )}.`;

  renderHours(hoursCol);
  timeline.innerHTML = '';
  taskList.innerHTML = '';

  const sortedTasks = [...tasks].sort((a, b) => minutesFromTime(a.start) - minutesFromTime(b.start));
  const lanesCount = Math.max(1, computeLanes(sortedTasks));
  const laneWidth = (timeline.clientWidth - 20 - (lanesCount - 1) * LANE_GAP) / lanesCount;

  sortedTasks.forEach((task, idx) => {
    const block = document.createElement('div');
    block.className = 'task-block';
    block.dataset.taskId = task.id;

    const top = minutesFromTime(task.start) * PIXELS_PER_MINUTE;
    const height = task.duration * PIXELS_PER_MINUTE;
    const left = 10 + task.lane * (laneWidth + LANE_GAP);

    block.style.top = `${top}px`;
    block.style.height = `${Math.max(height, 24)}px`;
    block.style.left = `${left}px`;
    block.style.width = `${laneWidth}px`;
    block.style.background = `linear-gradient(135deg, ${palette[idx % palette.length]}, #ffffff)`;
    block.innerHTML = `<strong>${task.name}</strong><span>${task.start} • ${formatDuration(task.duration)}</span>`;

    enableDrag(block, timeline);
    timeline.appendChild(block);

    const li = document.createElement('li');
    li.textContent = `${task.start} • ${task.name} • ${formatDuration(task.duration)}`;
    taskList.appendChild(li);
  });
}

function enableDrag(block, timeline) {
  let dragOffsetY = 0;

  const onPointerMove = (event) => {
    const task = tasks.find((t) => t.id === block.dataset.taskId);
    if (!task) return;

    const timelineRect = timeline.getBoundingClientRect();
    const minTop = 0;
    const maxTop = DAY_MINUTES * PIXELS_PER_MINUTE - task.duration * PIXELS_PER_MINUTE;
    const rawTop = event.clientY - timelineRect.top - dragOffsetY;
    const clampedTop = Math.max(minTop, Math.min(maxTop, rawTop));

    const rawMinutes = clampedTop / PIXELS_PER_MINUTE;
    const snapped = Math.round(rawMinutes / UNIT_MINUTES) * UNIT_MINUTES;

    task.start = timeFromMinutes(snapped);
    render();
  };

  const onPointerUp = () => {
    block.classList.remove('dragging');
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  };

  block.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    block.classList.add('dragging');
    dragOffsetY = event.offsetY;

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  });
}

function setupForm() {
  if (!isBrowser) return;

  const taskForm = document.getElementById('task-form');
  if (!taskForm) return;

  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(taskForm);
    const name = formData.get('name').toString().trim();
    const start = formData.get('start').toString();
    const duration = Number(formData.get('duration'));

    if (!name || !start || !duration || duration < UNIT_MINUTES) return;

    const startMinutes = minutesFromTime(start);
    if (startMinutes + duration > DAY_MINUTES) {
      alert('To zadanie wychodzi poza zakres doby 24h.');
      return;
    }

    tasks.push({ id: crypto.randomUUID(), name, start, duration });
    taskForm.reset();
    document.getElementById('duration').value = 60;
    render();
  });
}

if (isBrowser) {
  window.addEventListener('resize', render);
}

setupForm();
render();
