const ticketRows = document.getElementById("ticket-rows");
const searchInput = document.getElementById("ticket-search");
const statusFilter = document.getElementById("status-filter");
const emptyState = document.getElementById("empty-state");
const tableCount = document.getElementById("table-count");
const toast = document.getElementById("toast");
const ticketDialog = document.getElementById("ticket-dialog");

function filterTickets() {
  const query = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const rows = [...ticketRows.rows];
  let visible = 0;

  rows.forEach((row) => {
    const matchesQuery = row.textContent.toLowerCase().includes(query);
    const matchesStatus = status === "all" || row.dataset.status === status;
    row.hidden = !(matchesQuery && matchesStatus);
    if (!row.hidden) visible += 1;
  });

  emptyState.hidden = visible > 0;
  tableCount.textContent = `Showing ${visible} of ${document.getElementById("stat-total").textContent} tickets`;
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

searchInput.addEventListener("input", filterTickets);
statusFilter.addEventListener("change", filterTickets);
document.getElementById("new-ticket-button").addEventListener("click", () => ticketDialog.showModal());
document.getElementById("close-dialog").addEventListener("click", () => ticketDialog.close());
document.getElementById("cancel-dialog").addEventListener("click", () => ticketDialog.close());

ticketDialog.addEventListener("click", (event) => {
  if (event.target === ticketDialog) ticketDialog.close();
});

document.getElementById("ticket-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const requester = form.elements.requester.value.trim();
  const subject = form.elements.subject.value.trim();
  const priority = form.elements.priority.value;
  const initials = requester.split(/\s+/).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
  const ticketNumber = 1049 + ticketRows.rows.length - 5;
  const row = document.createElement("tr");
  row.dataset.status = "Open";

  const ticketCell = document.createElement("td");
  const ticketId = document.createElement("span");
  ticketId.className = "ticket-id";
  ticketId.textContent = `#TK-${ticketNumber}`;
  const ticketSubject = document.createElement("span");
  ticketSubject.className = "ticket-subject";
  ticketSubject.textContent = ` · ${subject}`;
  ticketCell.append(ticketId, ticketSubject);

  const requesterCell = document.createElement("td");
  const requesterLabel = document.createElement("span");
  requesterLabel.className = "requester";
  const avatar = document.createElement("span");
  avatar.className = "mini-avatar";
  avatar.textContent = initials || "?";
  requesterLabel.append(avatar, document.createTextNode(requester));
  requesterCell.append(requesterLabel);

  const statusCell = document.createElement("td");
  statusCell.innerHTML = '<span class="status open">Open</span>';
  const priorityCell = document.createElement("td");
  const priorityLabel = document.createElement("span");
  priorityLabel.className = `priority ${priority.toLowerCase()}`;
  priorityLabel.textContent = priority;
  priorityCell.append(priorityLabel);
  const assigneeCell = document.createElement("td");
  assigneeCell.textContent = "Unassigned";
  const updatedCell = document.createElement("td");
  updatedCell.textContent = "Just now";
  row.append(ticketCell, requesterCell, statusCell, priorityCell, assigneeCell, updatedCell);
  ticketRows.prepend(row);

  form.reset();
  ticketDialog.close();
  const total = document.getElementById("stat-total");
  total.textContent = Number(total.textContent) + 1;
  const open = document.getElementById("stat-open");
  open.textContent = Number(open.textContent) + 1;
  const navCount = document.getElementById("nav-ticket-count");
  navCount.textContent = Number(navCount.textContent) + 1;
  filterTickets();
  showToast(`Ticket #TK-${ticketNumber} created`);
});

document.getElementById("chart-period").addEventListener("change", (event) => {
  const monthly = event.target.value === "month";
  const labels = monthly ? ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const values = monthly
    ? [[52, 63], [68, 59], [56, 74], [79, 69], [66, 83], [86, 72], [73, 89]]
    : [[40, 53], [55, 48], [47, 68], [72, 61], [61, 78], [84, 68], [67, 83]];

  document.getElementById("chart-labels").replaceChildren(
    ...labels.map((label) => {
      const span = document.createElement("span");
      span.textContent = label;
      return span;
    }),
  );
  document.querySelectorAll("#chart-bars .bar-group").forEach((group, index) => {
    group.children[0].style.height = `${values[index][0]}%`;
    group.children[1].style.height = `${values[index][1]}%`;
  });
});

document.querySelectorAll("[data-status-link]").forEach((link) => {
  link.addEventListener("click", () => {
    statusFilter.value = link.dataset.statusLink;
    filterTickets();
  });
});

document.getElementById("notification-button").addEventListener("click", () => showToast("You’re all caught up!"));
document.getElementById("help-button").addEventListener("click", () => showToast("Help center is coming soon."));
document.getElementById("menu-button").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

document.querySelectorAll(".sidebar .nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".sidebar .nav a").forEach((item) => {
      item.classList.remove("active");
      item.removeAttribute("aria-current");
    });
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
    document.getElementById("sidebar").classList.remove("open");
  });
});
