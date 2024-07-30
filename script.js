// Attendre que le DOM soit complètement chargé avant d'exécuter mon script
document.addEventListener("DOMContentLoaded", function () {
  // Tableau pour stocker les tâches
  let tasks = [];
  let editingTaskId = null;
  //variable d'animation du cercle de chargement des données dans la balise tbody
  let rotationAngle = 0;
  let animationId = null;

  // Sélection des éléments du DOM
  const taskForm = document.getElementById("taskForm");
  const taskList = document
    .getElementById("taskList")
    .getElementsByTagName("tbody")[0];
  const exportBtn = document.getElementById("exportBtn");
  const submitBtn = document.getElementById("submitBtn");
  const loadingCircle = document.getElementById("loadingCircle");

  // Gestionnaire d'événement pour la soumission du formulaire
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const priority = document.getElementById("taskPriority").value;
    const status = document.getElementById("taskStatus").value;

    if (editingTaskId !== null) {
      // Mode édition : mettre à jour la tâche existante
      const taskIndex = tasks.findIndex((task) => task.id === editingTaskId);
      tasks[taskIndex] = { id: editingTaskId, title, priority, status };
      editingTaskId = null;
      submitBtn.textContent = "Ajouter la tâche";
    } else {
      // Mode ajout : créer une nouvelle tâche
      const id = Date.now();
      const newTask = { id, title, priority, status };
      tasks.push(newTask);
    }

    renderTasks();
    taskForm.reset();
  });

  // Fonction pour afficher les tâches dans le tableau
  function renderTasks() {
    taskList.innerHTML = "";
    // Simuler un délai de chargement du contenu du tableau avec une animation - cercle rotant
    showLoading();

    // attendre 1 seconde en simulant une animation de chargement avec cercle tournant
    setTimeout(() => {
      tasks.forEach((task, index) => {
        let date = new Date(task.id);
        let readableDate = date.toLocaleString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const row = taskList.insertRow();
        row.className = "new-task";
        row.style.animationDelay = `${index * 0.1}s`;
        row.innerHTML = `
              <td>${task.title}</td>
              <td>${task.priority}</td>
              <td>${task.status}</td>
              <td class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">Éditer</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Supprimer</button>
              </td>
              <td class="date">${readableDate}</td>
            `;
      });
      //cacher le cercle de chargement  après le chargement des données dans la balise tbody
      hideLoading();
    }, 1000);
  }

  //function d'animation request animation
  function animateLoadingCircle(timestamp) {
    rotationAngle += 5;
    loadingCircle.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg)`;

    if (loadingCircle.classList.contains("show")) {
      animationId = requestAnimationFrame(animateLoadingCircle);
    } else {
      cancelAnimationFrame(animationId);
      rotationAngle = 0;
    }
  }

  // Fonction pour afficher l'animation de chargement
  function showLoading() {
    loadingCircle.classList.add("show");
    if (!animationId) {
      animationId = requestAnimationFrame(animateLoadingCircle);
    }
  }

  // Fonction pour masquer l'animation de chargement
  function hideLoading() {
    loadingCircle.classList.remove("show");
  }

  // Fonction pour éditer une tâche (accessible globalement - utilisation de window)
  window.editTask = function (id) {
    const task = tasks.find((task) => task.id === id);
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskPriority").value = task.priority;
    document.getElementById("taskStatus").value = task.status;
    editingTaskId = id;
    submitBtn.textContent = "Mettre à jour la tâche";
  };

  // Fonction pour supprimer une tâche (accessible globalement - utilisation de window)
  window.deleteTask = function (id) {
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
  };

  // Gestionnaire d'événement pour l'exportation en CSV
  exportBtn.addEventListener("click", function () {
    //definir le contenu du fichier csv
    const mineType = "text/csv";
    const csvContent =
      "data:" +
      mineType +
      ";charset=utf-8," +
      "Titre,Priorité,Statut,Date\n" +
      tasks
        .map((task) => {
          let date = new Date(task.id);
          let formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
          return `${task.title},${task.priority},${task.status},${formattedDate}`;
        })
        .join("\n");
    //encoder le contenu du fichier csv pour le lien
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.setAttribute("download", "taches.csv");
    //simuler l'action de clique pour provoquer le téléchargement
    link.click();
  });

  // Ajout d'effets visuels sur les boutons
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.95)";
    });
    button.addEventListener("mouseup", function () {
      this.style.transform = "scale(1)";
    });
  });
});
