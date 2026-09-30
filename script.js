// ============================================
// MY PERSONAL PLANNER
// ============================================

const STORAGE_KEY = "myPlannerFinalData";


// ============================================
// DEFAULT DATA
// ============================================

const defaultCategories = [
    {
        id: crypto.randomUUID(),
        name: "Productivity",
        icon: "📚",
        tasks: [
            {
                id: crypto.randomUUID(),
                name: "Study",
                icon: "📖"
            },
            {
                id: crypto.randomUUID(),
                name: "English",
                icon: "🇬🇧"
            },
            {
                id: crypto.randomUUID(),
                name: "Reading",
                icon: "📚"
            }
        ]
    },

    {
        id: crypto.randomUUID(),
        name: "Self Care",
        icon: "🧴",
        tasks: [
            {
                id: crypto.randomUUID(),
                name: "Workout",
                icon: "🏃"
            },
            {
                id: crypto.randomUUID(),
                name: "Sleep",
                icon: "😴"
            },
            {
                id: crypto.randomUUID(),
                name: "Water",
                icon: "💧"
            },
            {
                id: crypto.randomUUID(),
                name: "Skincare",
                icon: "🧴"
            }
        ]
    }
];


let plannerData =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) ||
    defaultCategories;


let selectedDate =
    localStorage.getItem("selectedPlannerDate") ||
    getDateKey(new Date());


let activeCategoryId = null;

let emojiEditType = null;

let emojiEditCategoryId = null;

let emojiEditTaskId = null;

let selectedEditEmoji = "✨";


// ============================================
// EMOJI LIBRARY
// ============================================

const emojiGroups = {

    "✨ General": [
        "✨","⭐","🌟","💫","🌸","🌷","🌹","🌺",
        "🌻","🌱","🍀","🦋","🎀","🤍","💖","☀️",
        "🌙","☁️","🌈","🫧","🪻","🩷"
    ],

    "📚 Study": [
        "📚","📖","📕","📗","📘","📙","📝",
        "✏️","🖊️","📒","📓","🎓","🧠","💻",
        "🔤","📐","📏","🧮","🔬","🗒️"
    ],

    "🇬🇧 English": [
        "🇬🇧","🇺🇸","🗣️","💬","🔤","📖",
        "📚","🎧","🎤","✏️","📝","🌎"
    ],

    "🏃 Health": [
        "🏃","🏋️","💪","🧘","🚴","🏊",
        "⚽","🏀","🥗","🍎","💧","❤️",
        "🩷","🧴","😴","🌿"
    ],

    "🧴 Self Care": [
        "🧴","🛁","🧖","💆","🧘","🪞",
        "💅","🌸","🩷","🤍","🫧","🛌",
        "😴","🕯️","🌙"
    ],

    "💼 Work": [
        "💼","💻","📊","📈","📋","📁",
        "📌","📎","🖊️","☎️","💡","🗂️"
    ],

    "🏠 Life": [
        "🏠","🛏️","🧹","🧺","🍳","🛒",
        "🧼","🪴","🐈","☕","🍽️","🚗"
    ],

    "🎨 Fun": [
        "🎨","🎵","🎧","🎬","🎮","📷",
        "🎸","🎹","🎤","🎭","🎀","🧸"
    ]

};


// ============================================
// DATE
// ============================================

function getDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function dateFromKey(key) {

    const parts =
        key.split("-");

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );
}


function changeDay(amount) {

    const date =
        dateFromKey(selectedDate);

    date.setDate(
        date.getDate() + amount
    );

    selectedDate =
        getDateKey(date);

    localStorage.setItem(
        "selectedPlannerDate",
        selectedDate
    );

    renderPlanner();
}


// ============================================
// DAILY DATA
// ============================================

function getDayData(dateKey) {

    const storage =
        JSON.parse(
            localStorage.getItem(
                "plannerDays"
            ) || "{}"
        );


    if (!storage[dateKey]) {

        storage[dateKey] = {
            completed: {},
            note: ""
        };

        localStorage.setItem(
            "plannerDays",
            JSON.stringify(storage)
        );
    }


    return storage[dateKey];
}


function saveDayData(
    dateKey,
    data
) {

    const storage =
        JSON.parse(
            localStorage.getItem(
                "plannerDays"
            ) || "{}"
        );

    storage[dateKey] =
        data;

    localStorage.setItem(
        "plannerDays",
        JSON.stringify(storage)
    );
}


// ============================================
// SAVE
// ============================================

function savePlanner() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            plannerData
        )
    );
}


// ============================================
// DATE DISPLAY
// ============================================

function renderDate() {

    const date =
        dateFromKey(
            selectedDate
        );

    document.getElementById(
        "pretty-date"
    ).textContent =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    document.getElementById(
        "date-picker"
    ).value =
        selectedDate;
}


// ============================================
// MAIN RENDER
// ============================================

function renderPlanner() {

    renderDate();

    renderCategories();

    renderNote();

    updateDailyProgress();

    renderWeeklyChart();

    renderMonthlyChart();

    renderActivityAnalysis();
}


// ============================================
// CATEGORIES
// ============================================

function renderCategories() {

    const container =
        document.getElementById(
            "categories-container"
        );

    container.innerHTML = "";


    plannerData.forEach(
        category => {

            container.appendChild(
                createCategory(category)
            );

        }
    );
}


function createCategory(
    category
) {

    const card =
        document.createElement("section");

    card.className =
        "category-card";

    card.dataset.id =
        category.id;


    const header =
        document.createElement("div");

    header.className =
        "category-header";


    const title =
        document.createElement("div");

    title.className =
        "category-title";


    title.innerHTML = `
        <span class="category-icon">
            ${escapeHTML(category.icon)}
        </span>

        <div>
            <h2>${escapeHTML(category.name)}</h2>
            <p>Tasks & activities</p>
        </div>
    `;


    const right =
        document.createElement("div");

    right.style.display =
        "flex";

    right.style.alignItems =
        "center";


    const count =
        document.createElement("span");

    count.className =
        "category-count";


    const menuButton =
        document.createElement("button");

    menuButton.className =
        "category-menu-button";

    menuButton.type =
        "button";

    menuButton.textContent =
        "•••";


    right.appendChild(count);

    right.appendChild(menuButton);

    header.appendChild(title);

    header.appendChild(right);

    card.appendChild(header);


    // CATEGORY MENU

    const menu =
        document.createElement("div");

    menu.className =
        "category-menu";

    menu.innerHTML = `
        <button data-action="edit">
            ✏️ Edit category
        </button>

        <button data-action="icon">
            🎀 Change icon
        </button>

        <button data-action="up">
            ⬆️ Move up
        </button>

        <button data-action="down">
            ⬇️ Move down
        </button>

        <button data-action="delete">
            🗑️ Delete category
        </button>
    `;


    card.appendChild(menu);


    menuButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            closeMenus();

            menu.classList.toggle(
                "open"
            );

        }
    );


    menu.querySelectorAll(
        "button"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    handleCategoryAction(
                        button.dataset.action,
                        category.id
                    );

                }
            );

        }
    );


    // TASKS

    const taskList =
        document.createElement("div");

    taskList.className =
        "task-list";


    category.tasks.forEach(
        task => {

            taskList.appendChild(
                createTask(
                    category,
                    task
                )
            );

        }
    );


    card.appendChild(taskList);


    // ADD TASK

    const addButton =
        document.createElement("button");

    addButton.className =
        "add-task";

    addButton.type =
        "button";

    addButton.textContent =
        "+ Add task";


    addButton.addEventListener(
        "click",
        function() {

            openTaskModal(
                category.id
            );

        }
    );


    card.appendChild(
        addButton
    );


    updateCategoryCount(
        card,
        category
    );


    return card;
}


// ============================================
// TASK
// ============================================

function createTask(
    category,
    task
) {

    const label =
        document.createElement("label");

    label.className =
        "task";

    label.dataset.id =
        task.id;


    const checkbox =
        document.createElement("input");

    checkbox.type =
        "checkbox";


    const dayData =
        getDayData(
            selectedDate
        );


    checkbox.checked =
        !!dayData.completed[
            task.id
        ];


    const text =
        document.createElement("span");

    text.textContent =
        `${task.icon} ${task.name}`;


    checkbox.addEventListener(
        "change",
        function() {

            const data =
                getDayData(
                    selectedDate
                );

            data.completed[
                task.id
            ] =
                checkbox.checked;

            saveDayData(
                selectedDate,
                data
            );

            updateDailyProgress();

            renderWeeklyChart();

            renderMonthlyChart();

            renderActivityAnalysis();

        }
    );


    const menuButton =
        document.createElement("button");

    menuButton.className =
        "task-menu-button";

    menuButton.type =
        "button";

    menuButton.textContent =
        "•••";


    const menu =
        document.createElement("div");

    menu.className =
        "task-menu";


    menu.innerHTML = `
        <button data-action="edit">
            ✏️ Edit
        </button>

        <button data-action="icon">
            🎀 Change icon
        </button>

        <button data-action="up">
            ⬆️ Move up
        </button>

        <button data-action="down">
            ⬇️ Move down
        </button>

        <button data-action="delete">
            🗑️ Delete
        </button>
    `;


    menuButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            closeMenus();

            menu.classList.toggle(
                "open"
            );

        }
    );


    menu.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

        }
    );


    menu.querySelectorAll(
        "button"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    handleTaskAction(
                        button.dataset.action,
                        category.id,
                        task.id
                    );

                }
            );

        }
    );


    label.appendChild(
        checkbox
    );

    label.appendChild(
        text
    );

    label.appendChild(
        menuButton
    );

    label.appendChild(
        menu
    );


    return label;
}


// ============================================
// CATEGORY COUNT
// ============================================

function updateCategoryCount(
    card,
    category
) {

    const data =
        getDayData(
            selectedDate
        );


    const completed =
        category.tasks.filter(
            task =>
                !!data.completed[
                    task.id
                ]
        ).length;


    const count =
        card.querySelector(
            ".category-count"
        );


    count.textContent =
        `${completed} / ${category.tasks.length}`;
}


// ============================================
// TASK MODAL
// ============================================

function openTaskModal(
    categoryId
) {

    activeCategoryId =
        categoryId;


    document.getElementById(
        "task-name-input"
    ).value = "";


    document.getElementById(
        "task-icon-input"
    ).value = "✨";


    buildEmojiPicker(
        "task-emoji-picker",
        "task-icon-input"
    );


    document.getElementById(
        "task-modal"
    ).classList.add("open");


    setTimeout(
        () => {

            document.getElementById(
                "task-name-input"
            ).focus();

        },
        50
    );
}


function closeTaskModal() {

    document.getElementById(
        "task-modal"
    ).classList.remove("open");

    activeCategoryId =
        null;
}


function saveTaskFromModal() {

    const name =
        document.getElementById(
            "task-name-input"
        ).value.trim();


    const icon =
        document.getElementById(
            "task-icon-input"
        ).value.trim() ||
        "✨";


    if (!name) {

        alert(
            "Please enter a task name."
        );

        return;
    }


    const category =
        plannerData.find(
            category =>
                category.id ===
                activeCategoryId
        );


    if (!category) return;


    category.tasks.push({

        id: crypto.randomUUID(),

        name: name,

        icon: icon

    });


    savePlanner();

    closeTaskModal();

    renderPlanner();
}


// ============================================
// CATEGORY MODAL
// ============================================

function openCategoryModal() {

    document.getElementById(
        "category-name-input"
    ).value = "";


    document.getElementById(
        "category-icon-input"
    ).value = "✨";


    buildEmojiPicker(
        "category-emoji-picker",
        "category-icon-input"
    );


    document.getElementById(
        "category-modal"
    ).classList.add("open");


    setTimeout(
        () => {

            document.getElementById(
                "category-name-input"
            ).focus();

        },
        50
    );
}


function closeCategoryModal() {

    document.getElementById(
        "category-modal"
    ).classList.remove("open");
}


function saveCategoryFromModal() {

    const name =
        document.getElementById(
            "category-name-input"
        ).value.trim();


    const icon =
        document.getElementById(
            "category-icon-input"
        ).value.trim() ||
        "✨";


    if (!name) {

        alert(
            "Please enter a category name."
        );

        return;
    }


    plannerData.push({

        id: crypto.randomUUID(),

        name: name,

        icon: icon,

        tasks: []

    });


    savePlanner();

    closeCategoryModal();

    renderPlanner();
}


// ============================================
// EMOJI PICKER
// ============================================

function buildEmojiPicker(
    containerId,
    inputId,
    selected = ""
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) return;


    container.innerHTML = "";


    Object.entries(
        emojiGroups
    ).forEach(
        ([groupName, emojis]) => {

            const title =
                document.createElement(
                    "div"
                );

            title.style.width =
                "100%";

            title.style.fontSize =
                "11px";

            title.style.color =
                "#958b82";

            title.style.fontWeight =
                "bold";

            title.style.marginTop =
                "5px";

            title.textContent =
                groupName;


            container.appendChild(
                title
            );


            emojis.forEach(
                emoji => {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type =
                        "button";

                    button.className =
                        "emoji-button";


                    if (
                        emoji === selected
                    ) {

                        button.classList.add(
                            "selected"
                        );

                    }


                    button.textContent =
                        emoji;


                    button.addEventListener(
                        "click",
                        function() {

                            document.getElementById(
                                inputId
                            ).value =
                                emoji;


                            container
                                .querySelectorAll(
                                    ".emoji-button"
                                )
                                .forEach(
                                    item =>
                                        item.classList.remove(
                                            "selected"
                                        )
                                );


                            button.classList.add(
                                "selected"
                            );

                        }
                    );


                    container.appendChild(
                        button
                    );

                }
            );

        }
    );
}


// ============================================
// SMART EMOJI SUGGESTIONS
// ============================================

function getSmartEmojis(
    text
) {

    const value =
        text.toLowerCase();


    if (
        value.includes("study") ||
        value.includes("درس") ||
        value.includes("university") ||
        value.includes("دانشگاه")
    ) {

        return [
            "📚",
            "📖",
            "🎓",
            "📝",
            "✏️",
            "🧠",
            "💻"
        ];

    }


    if (
        value.includes("english") ||
        value.includes("زبان")
    ) {

        return [
            "🇬🇧",
            "🇺🇸",
            "📚",
            "🗣️",
            "🎧",
            "🔤",
            "✏️"
        ];

    }


    if (
        value.includes("read") ||
        value.includes("reading") ||
        value.includes("کتاب") ||
        value.includes("مطالعه")
    ) {

        return [
            "📚",
            "📖",
            "☕",
            "📝",
            "🌙",
            "🕯️"
        ];

    }


    if (
        value.includes("workout") ||
        value.includes("gym") ||
        value.includes("ورزش") ||
        value.includes("باشگاه")
    ) {

        return [
            "🏃",
            "🏋️",
            "💪",
            "🧘",
            "🥗",
            "❤️"
        ];

    }


    if (
        value.includes("sleep") ||
        value.includes("خواب")
    ) {

        return [
            "😴",
            "🌙",
            "🛌",
            "☁️",
            "⭐",
            "🕯️"
        ];

    }


    if (
        value.includes("water") ||
        value.includes("آب")
    ) {

        return [
            "💧",
            "🥤",
            "🚰",
            "🫧",
            "💦"
        ];

    }


    if (
        value.includes("skin") ||
        value.includes("پوست")
    ) {

        return [
            "🧴",
            "🫧",
            "🧖",
            "✨",
            "🌸",
            "🪞"
        ];

    }


    return [
        "✨",
        "⭐",
        "🌸",
        "🎀",
        "🦋",
        "🌱",
        "🤍",
        "💖"
    ];
}


// ============================================
// EDIT EMOJI
// ============================================

function openEmojiEditModal(
    type,
    categoryId,
    taskId = null
) {

    emojiEditType =
        type;

    emojiEditCategoryId =
        categoryId;

    emojiEditTaskId =
        taskId;


    let currentIcon =
        "✨";

    let itemName =
        "";


    const category =
        plannerData.find(
            category =>
                category.id ===
                categoryId
        );


    if (!category) return;


    if (type === "task") {

        const task =
            category.tasks.find(
                task =>
                    task.id === taskId
            );

        if (!task) return;

        currentIcon =
            task.icon;

        itemName =
            task.name;

    }


    if (type === "category") {

        currentIcon =
            category.icon;

        itemName =
            category.name;

    }


    selectedEditEmoji =
        currentIcon;


    document.getElementById(
        "edit-custom-emoji"
    ).value =
        currentIcon;


    document.getElementById(
        "emoji-edit-subtitle"
    ).textContent =
        `Choose an icon for "${itemName}"`;


    buildEmojiPicker(
        "edit-emoji-picker",
        "edit-custom-emoji",
        currentIcon
    );


    // Smart suggestions first

    const smart =
        getSmartEmojis(
            itemName
        );


    const picker =
        document.getElementById(
            "edit-emoji-picker"
        );


    const smartTitle =
        document.createElement(
            "div"
        );

    smartTitle.style.width =
        "100%";

    smartTitle.style.fontSize =
        "12px";

    smartTitle.style.fontWeight =
        "bold";

    smartTitle.style.color =
        "#756c64";

    smartTitle.style.marginBottom =
        "5px";

    smartTitle.textContent =
        "✨ Suggested for this activity";


    picker.prepend(
        smartTitle
    );


    smart.reverse()
        .forEach(
            emoji => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.className =
                    "emoji-button";

                button.textContent =
                    emoji;


                button.addEventListener(
                    "click",
                    function() {

                        selectedEditEmoji =
                            emoji;

                        document.getElementById(
                            "edit-custom-emoji"
                        ).value =
                            emoji;

                        picker
                            .querySelectorAll(
                                ".emoji-button"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "selected"
                                    )
                            );

                        button.classList.add(
                            "selected"
                        );

                    }
                );


                picker.prepend(
                    button
                );

            }
        );


    document.getElementById(
        "emoji-edit-modal"
    ).classList.add(
        "open"
    );
}


function closeEmojiEditModal() {

    document.getElementById(
        "emoji-edit-modal"
    ).classList.remove(
        "open"
    );


    emojiEditType =
        null;

    emojiEditCategoryId =
        null;

    emojiEditTaskId =
        null;
}


function saveEmojiEdit() {

    const emoji =
        document.getElementById(
            "edit-custom-emoji"
        ).value.trim();


    if (!emoji) {

        alert(
            "Please choose an emoji."
        );

        return;
    }


    const category =
        plannerData.find(
            category =>
                category.id ===
                emojiEditCategoryId
        );


    if (!category) return;


    if (
        emojiEditType ===
        "category"
    ) {

        category.icon =
            emoji;

    }


    if (
        emojiEditType ===
        "task"
    ) {

        const task =
            category.tasks.find(
                task =>
                    task.id ===
                    emojiEditTaskId
            );


        if (task) {

            task.icon =
                emoji;

        }

    }


    savePlanner();

    closeEmojiEditModal();

    renderPlanner();
}


// ============================================
// TASK ACTIONS
// ============================================

function handleTaskAction(
    action,
    categoryId,
    taskId
) {

    const category =
        plannerData.find(
            category =>
                category.id ===
                categoryId
        );


    if (!category) return;


    const index =
        category.tasks.findIndex(
            task =>
                task.id ===
                taskId
        );


    if (index === -1) return;


    const task =
        category.tasks[index];


    if (action === "edit") {

        const newName =
            prompt(
                "Task name:",
                task.name
            );


        if (
            newName &&
            newName.trim()
        ) {

            task.name =
                newName.trim();

        }

    }


    if (action === "icon") {

        openEmojiEditModal(
            "task",
            categoryId,
            taskId
        );

        return;
    }


    if (action === "up") {

        if (index > 0) {

            [
                category.tasks[index - 1],
                category.tasks[index]
            ] = [
                category.tasks[index],
                category.tasks[index - 1]
            ];

        }

    }


    if (action === "down") {

        if (
            index <
            category.tasks.length - 1
        ) {

            [
                category.tasks[index + 1],
                category.tasks[index]
            ] = [
                category.tasks[index],
                category.tasks[index + 1]
            ];

        }

    }


    if (action === "delete") {

        if (
            confirm(
                "Delete this task?"
            )
        ) {

            category.tasks.splice(
                index,
                1
            );

        }

    }


    savePlanner();

    renderPlanner();
}


// ============================================
// CATEGORY ACTIONS
// ============================================

function handleCategoryAction(
    action,
    categoryId
) {

    const index =
        plannerData.findIndex(
            category =>
                category.id ===
                categoryId
        );


    if (index === -1) return;


    const category =
        plannerData[index];


    if (action === "edit") {

        const newName =
            prompt(
                "Category name:",
                category.name
            );


        if (
            newName &&
            newName.trim()
        ) {

            category.name =
                newName.trim();

        }

    }


    if (action === "icon") {

        openEmojiEditModal(
            "category",
            categoryId
        );

        return;
    }


    if (action === "up") {

        if (index > 0) {

            [
                plannerData[index - 1],
                plannerData[index]
            ] = [
                plannerData[index],
                plannerData[index - 1]
            ];

        }

    }


    if (action === "down") {

        if (
            index <
            plannerData.length - 1
        ) {

            [
                plannerData[index + 1],
                plannerData[index]
            ] = [
                plannerData[index],
                plannerData[index + 1]
            ];

        }

    }


    if (action === "delete") {

        if (
            confirm(
                "Delete this category and all its tasks?"
            )
        ) {

            plannerData.splice(
                index,
                1
            );

        }

    }


    savePlanner();

    renderPlanner();
}


// ============================================
// DAILY PROGRESS
// ============================================

function calculateDayProgress(
    dateKey
) {

    const data =
        getDayData(
            dateKey
        );


    let total = 0;

    let completed = 0;


    plannerData.forEach(
        category => {

            category.tasks.forEach(
                task => {

                    total++;

                    if (
                        data.completed[
                            task.id
                        ]
                    ) {

                        completed++;

                    }

                }
            );

        }
    );


    const percentage =
        total === 0
            ? 0
            : Math.round(
                completed /
                total *
                100
            );


    return {
        total,
        completed,
        percentage
    };
}


function updateDailyProgress() {

    const progress =
        calculateDayProgress(
            selectedDate
        );


    document.getElementById(
        "header-progress"
    ).textContent =
        progress.percentage + "%";


    document.getElementById(
        "daily-percentage"
    ).textContent =
        progress.percentage + "%";


    document.getElementById(
        "daily-progress-fill"
    ).style.width =
        progress.percentage + "%";


    document.getElementById(
        "daily-progress-text"
    ).textContent =
        `${progress.completed} of ${progress.total} tasks completed`;


    document
        .querySelectorAll(
            ".category-card"
        )
        .forEach(
            card => {

                const category =
                    plannerData.find(
                        item =>
                            item.id ===
                            card.dataset.id
                    );


                if (category) {

                    updateCategoryCount(
                        card,
                        category
                    );

                }

            }
        );
}


// ============================================
// NOTE
// ============================================

function renderNote() {

    const data =
        getDayData(
            selectedDate
        );


    document.getElementById(
        "daily-note"
    ).value =
        data.note || "";
}


document
    .getElementById(
        "daily-note"
    )
    .addEventListener(
        "input",
        function() {

            const data =
                getDayData(
                    selectedDate
                );

            data.note =
                this.value;

            saveDayData(
                selectedDate,
                data
            );

        }
    );


// ============================================
// WEEKLY
// ============================================

function getStartOfWeek(
    date
) {

    const result =
        new Date(date);

    const day =
        result.getDay();

    const difference =
        day === 0
            ? -6
            : 1 - day;

    result.setDate(
        result.getDate() +
        difference
    );

    return result;
}


function renderWeeklyChart() {

    const chart =
        document.getElementById(
            "weekly-chart"
        );

    chart.innerHTML = "";


    const start =
        getStartOfWeek(
            dateFromKey(
                selectedDate
            )
        );


    const days = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];


    let totalPercentage = 0;


    days.forEach(
        (
            dayName,
            index
        ) => {

            const date =
                new Date(start);

            date.setDate(
                start.getDate() +
                index
            );


            const key =
                getDateKey(date);


            const progress =
                calculateDayProgress(
                    key
                );


            totalPercentage +=
                progress.percentage;


            const column =
                document.createElement(
                    "div"
                );

            column.className =
                "day-column";


            const percent =
                document.createElement(
                    "div"
                );

            percent.className =
                "day-percent";

            percent.textContent =
                progress.percentage +
                "%";


            const barArea =
                document.createElement(
                    "div"
                );

            barArea.className =
                "day-bar-area";


            const bar =
                document.createElement(
                    "div"
                );

            bar.className =
                "day-bar";

            bar.style.height =
                Math.max(
                    progress.percentage,
                    2
                ) + "%";


            const name =
                document.createElement(
                    "div"
                );

            name.className =
                "day-name";

            name.textContent =
                dayName;


            barArea.appendChild(
                bar
            );

            column.appendChild(
                percent
            );

            column.appendChild(
                barArea
            );

            column.appendChild(
                name
            );

            chart.appendChild(
                column
            );

        }
    );


    const average =
        Math.round(
            totalPercentage /
            7
        );


    document.getElementById(
        "weekly-summary"
    ).textContent =
        `Your average progress this week is ${average}%.`;
}


// ============================================
// MONTHLY
// ============================================

function renderMonthlyChart() {

    const chart =
        document.getElementById(
            "monthly-chart"
        );

    chart.innerHTML = "";


    const currentDate =
        dateFromKey(
            selectedDate
        );


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    let total = 0;


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const key =
            getDateKey(
                date
            );


        const progress =
            calculateDayProgress(
                key
            );


        total +=
            progress.percentage;


        const row =
            document.createElement(
                "div"
            );

        row.className =
            "month-row";


        const label =
            document.createElement(
                "span"
            );

        label.className =
            "month-row-label";

        label.textContent =
            day;


        const track =
            document.createElement(
                "div"
            );

        track.className =
            "month-row-track";


        const fill =
            document.createElement(
                "div"
            );

        fill.className =
            "month-row-fill";

        fill.style.width =
            progress.percentage +
            "%";


        const percent =
            document.createElement(
                "span"
            );

        percent.className =
            "month-row-percent";

        percent.textContent =
            progress.percentage +
            "%";


        track.appendChild(
            fill
        );

        row.appendChild(
            label
        );

        row.appendChild(
            track
        );

        row.appendChild(
            percent
        );

        chart.appendChild(
            row
        );

    }


    const average =
        Math.round(
            total /
            daysInMonth
        );


    const monthName =
        currentDate.toLocaleDateString(
            "en-US",
            {
                month: "long"
            }
        );


    document.getElementById(
        "monthly-summary"
    ).textContent =
        `${monthName}'s average daily progress is ${average}%.`;
}


// ============================================
// ACTIVITY ANALYSIS
// ============================================

function renderActivityAnalysis() {

    const container =
        document.getElementById(
            "activity-analysis"
        );

    container.innerHTML = "";


    const allTasks = [];


    plannerData.forEach(
        category => {

            category.tasks.forEach(
                task => {

                    allTasks.push({
                        ...task,
                        category:
                            category.name
                    });

                }
            );

        }
    );


    if (
        allTasks.length === 0
    ) {

        container.innerHTML =
            `<p class="summary-text">
                Add some tasks to see your activity analysis.
            </p>`;

        return;
    }


    const storage =
        JSON.parse(
            localStorage.getItem(
                "plannerDays"
            ) || "{}"
        );


    const dates =
        Object.keys(
            storage
        );


    const results =
        allTasks.map(
            task => {

                let done = 0;


                dates.forEach(
                    date => {

                        if (
                            storage[date] &&
                            storage[date].completed &&
                            storage[date].completed[
                                task.id
                            ]
                        ) {

                            done++;

                        }

                    }
                );


                return {
                    ...task,
                    done
                };

            }
        );


    results.sort(
        (a, b) =>
            b.done -
            a.done
    );


    results.forEach(
        task => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "analysis-item";


            const name =
                document.createElement(
                    "div"
                );

            name.className =
                "analysis-name";

            name.textContent =
                `${task.icon} ${task.name}`;


            const percentage =
                dates.length === 0
                    ? 0
                    : Math.round(
                        task.done /
                        dates.length *
                        100
                    );


            const percent =
                document.createElement(
                    "span"
                );

            percent.className =
                "analysis-percent";

            percent.textContent =
                percentage + "%";


            item.appendChild(
                name
            );

            item.appendChild(
                percent
            );

            container.appendChild(
                item
            );

        }
    );
}


// ============================================
// BUTTONS
// ============================================

document
    .getElementById(
        "add-category"
    )
    .addEventListener(
        "click",
        openCategoryModal
    );


document
    .getElementById(
        "previous-day"
    )
    .addEventListener(
        "click",
        () => changeDay(-1)
    );


document
    .getElementById(
        "next-day"
    )
    .addEventListener(
        "click",
        () => changeDay(1)
    );


document
    .getElementById(
        "today-button"
    )
    .addEventListener(
        "click",
        function() {

            selectedDate =
                getDateKey(
                    new Date()
                );

            localStorage.setItem(
                "selectedPlannerDate",
                selectedDate
            );

            renderPlanner();

        }
    );


document
    .getElementById(
        "date-picker"
    )
    .addEventListener(
        "change",
        function() {

            if (!this.value) return;

            selectedDate =
                this.value;

            localStorage.setItem(
                "selectedPlannerDate",
                selectedDate
            );

            renderPlanner();

        }
    );


// ============================================
// MODAL BUTTONS
// ============================================

document
    .getElementById(
        "save-task-modal"
    )
    .addEventListener(
        "click",
        saveTaskFromModal
    );


document
    .getElementById(
        "cancel-task-modal"
    )
    .addEventListener(
        "click",
        closeTaskModal
    );


document
    .getElementById(
        "close-task-modal"
    )
    .addEventListener(
        "click",
        closeTaskModal
    );


document
    .getElementById(
        "save-category-modal"
    )
    .addEventListener(
        "click",
        saveCategoryFromModal
    );


document
    .getElementById(
        "cancel-category-modal"
    )
    .addEventListener(
        "click",
        closeCategoryModal
    );


document
    .getElementById(
        "close-category-modal"
    )
    .addEventListener(
        "click",
        closeCategoryModal
    );


// EMOJI EDIT

document
    .getElementById(
        "save-emoji-edit"
    )
    .addEventListener(
        "click",
        saveEmojiEdit
    );


document
    .getElementById(
        "cancel-emoji-edit"
    )
    .addEventListener(
        "click",
        closeEmojiEditModal
    );


document
    .getElementById(
        "close-emoji-edit-modal"
    )
    .addEventListener(
        "click",
        closeEmojiEditModal
    );


// ============================================
// ENTER KEY
// ============================================

document
    .getElementById(
        "task-name-input"
    )
    .addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                saveTaskFromModal();

            }

        }
    );


document
    .getElementById(
        "category-name-input"
    )
    .addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                saveCategoryFromModal();

            }

        }
    );


// ============================================
// CLOSE MODALS
// ============================================

document
    .getElementById(
        "task-modal"
    )
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeTaskModal();

            }

        }
    );


document
    .getElementById(
        "category-modal"
    )
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeCategoryModal();

            }

        }
    );


document
    .getElementById(
        "emoji-edit-modal"
    )
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeEmojiEditModal();

            }

        }
    );


// ============================================
// ESC
// ============================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeTaskModal();

            closeCategoryModal();

            closeEmojiEditModal();

        }

    }
);


// ============================================
// CLOSE MENUS
// ============================================

document.addEventListener(
    "click",
    function() {

        closeMenus();

    }
);


function closeMenus() {

    document
        .querySelectorAll(
            ".task-menu.open, .category-menu.open"
        )
        .forEach(
            menu =>
                menu.classList.remove(
                    "open"
                )
        );
}


// ============================================
// SECURITY
// ============================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;
}


// ============================================
// START
// ============================================

renderPlanner();if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("My Planner is ready for offline use!"))
      .catch(error => console.error("Service Worker error:", error));
  });
}// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => {
      console.log("Service Worker registered successfully!");
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}