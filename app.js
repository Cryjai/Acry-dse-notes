// Cyber Futuristic Notes App - JavaScript

// Notes Data Structure
const notesData = {
    categories: [
        {
            id: "chinese",
            name: "中文",
            notes: [
                {
                    id: "classical_chinese",
                    title: "文言文秘笈",
                    content: "之乎者也終極攻略，包括常用虛詞、實詞解析。重點掌握：\n1. 虛詞：之、乎、者、也、矣、焉、哉\n2. 實詞：通假字、古今異義\n3. 句式：判斷句、被動句、倒裝句",
                    tags: ["文言文", "虛詞", "DSE中文"]
                },
                {
                    id: "essay_writing",
                    title: "作文神技",
                    content: "議論文三段論 + 記敘文情感渲染技巧\n議論文結構：\n- 引論：提出論點\n- 本論：論證分析\n- 結論：總結昇華\n記敘文技巧：細節描寫、情感渲染、首尾呼應",
                    tags: ["作文", "議論文", "記敘文"]
                }
            ]
        },
        {
            id: "english",
            name: "英文",
            notes: [
                {
                    id: "Vocab/ phases",
                    title: "useful in writing",
                    content: "- As clear as mud = very unclear \n- A gloomy(暗淡）/rosy(光明）outlook/prospect \n- Provide food for thought 發人深省\n- venerate/revere =greatly admire\n- my alma mater 母校\n- change the trajectory of somebody's life",
                    tags: ["phases", "vocab", "DSE English"]
                },
                {
                    id: "grammar_hacks",
                    title: "Grammar Hacks",
                    content: "Present Perfect vs Past Simple rules and exceptions:\n- Present Perfect: actions with present relevance\n- Past Simple: completed actions in the past\n- Key words: already, just, yet, since, for",
                    tags: ["grammar", "tenses", "DSE English"]
                },
                {
                    id: "essay_formula",
                    title: "Essay Writing Formula",
                    content: "Introduction + Body paragraphs + Conclusion structure:\n1. Hook + Background + Thesis\n2. Topic sentence + Evidence + Analysis\n3. Restate thesis + Summary + Call to action",
                    tags: ["essay", "writing", "structure"]
                }
            ]
        },
        {
            id: "econ",
            name: "Econ",
            notes: [
                {
                    id: "supply_demand",
                    title: "Supply & Demand",
                    content: "Market equilibrium analysis and price mechanisms:\n- Supply curve: upward sloping\n- Demand curve: downward sloping\n- Equilibrium: where S = D\n- Price changes affect quantity demanded/supplied",
                    tags: ["microeconomics", "market", "DSE Econ"]
                },
                {
                    id: "gdp_calculation",
                    title: "GDP Calculation",
                    content: "Nominal vs Real GDP, inflation adjustments:\n- Nominal GDP: current market prices\n- Real GDP: constant prices (adjusted for inflation)\n- GDP Deflator = (Nominal GDP / Real GDP) × 100",
                    tags: ["macroeconomics", "GDP", "inflation"]
                }
            ]
        },
        {
            id: "chinese_history",
            name: "中史",
            notes: [
                {
                    id: "tang_dynasty",
                    title: "唐朝盛世",
                    content: "貞觀之治、開元盛世政治經濟文化特色：\n政治：三省六部制、科舉制度完善\n經濟：農業發達、商業繁榮、絲綢之路\n文化：詩歌鼎盛、佛教興盛、對外開放",
                    tags: ["唐朝", "政治", "經濟"]
                },
                {
                    id: "ming_qing",
                    title: "明清變遷",
                    content: "明末清初政治制度變化與影響：\n明朝：內閣制、廠衛制度\n清朝：議政王大臣會議、軍機處\n影響：中央集權加強、滿漢關係緊張",
                    tags: ["明清", "政治制度", "變遷"]
                }
            ]
        }
    ]
};

// App State
let currentCategory = 'chinese';
let filteredNotes = [];
let expandedNotes = new Set();

// DOM Elements
let tabButtons, notesContainer, searchInput, copyModal, loadingOverlay;

// Make functions global so they can be called from HTML
window.toggleNote = toggleNote;
window.copyNote = copyNote;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    tabButtons = document.querySelectorAll('.tab-btn');
    notesContainer = document.getElementById('notes-container');
    searchInput = document.getElementById('search-input');
    copyModal = document.getElementById('copy-modal');
    loadingOverlay = document.getElementById('loading');
    
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    showLoading();
    setTimeout(() => {
        loadCategory(currentCategory);
        hideLoading();
    }, 500);
}

function setupEventListeners() {
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });

    // Search functionality - single event listener
    searchInput.addEventListener('input', function(event) {
        handleSearch(event.target.value);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

function handleTabClick(event) {
    const categoryId = event.currentTarget.getAttribute('data-category');
    
    if (categoryId !== currentCategory) {
        showLoading();
        
        // Update active tab
        tabButtons.forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        // Switch category with animation
        setTimeout(() => {
            currentCategory = categoryId;
            expandedNotes.clear(); // Clear expanded state when switching categories
            loadCategory(categoryId);
            searchInput.value = ''; // Clear search
            hideLoading();
        }, 200);
    }
}

function handleSearch(searchTerm) {
    const searchValue = searchTerm.toLowerCase().trim();
    const currentCategoryData = notesData.categories.find(cat => cat.id === currentCategory);
    
    if (!currentCategoryData) return;
    
    if (searchValue === '') {
        filteredNotes = [...currentCategoryData.notes];
    } else {
        filteredNotes = currentCategoryData.notes.filter(note => 
            note.title.toLowerCase().includes(searchValue) ||
            note.content.toLowerCase().includes(searchValue) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchValue))
        );
    }
    
    renderNotes(filteredNotes);
}

function loadCategory(categoryId) {
    const categoryData = notesData.categories.find(cat => cat.id === categoryId);
    if (categoryData) {
        filteredNotes = [...categoryData.notes];
        renderNotes(filteredNotes);
        
        // Update search placeholder based on category
        const categoryName = categoryData.name;
        searchInput.placeholder = `搜尋 ${categoryName} 筆記...`;
    }
}

function renderNotes(notes) {
    if (!notesContainer) return;
    
    notesContainer.innerHTML = '';
    
    if (notes.length === 0) {
        notesContainer.innerHTML = `
            <div style="text-align: center; color: #0099CC; font-size: 1.2rem; grid-column: 1 / -1; padding: 2rem;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
                沒有找到相關筆記
            </div>
        `;
        return;
    }
    
    notes.forEach((note, index) => {
        const noteElement = createNoteElement(note);
        notesContainer.appendChild(noteElement);
        
        // Animate cards in
        noteElement.style.opacity = '0';
        noteElement.style.transform = 'translateY(20px)';
        setTimeout(() => {
            noteElement.style.transition = 'all 0.5s ease';
            noteElement.style.opacity = '1';
            noteElement.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function createNoteElement(note) {
    const isExpanded = expandedNotes.has(note.id);
    
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-card';
    noteDiv.innerHTML = `
        <div class="note-header">
            <h3 class="note-title" onclick="toggleNote('${note.id}')">${note.title}</h3>
            <div class="note-actions">
                <button class="copy-btn" onclick="copyNote('${note.id}')" title="複製筆記">
                    📋
                </button>
                <button class="expand-btn" onclick="toggleNote('${note.id}')" title="${isExpanded ? '收起' : '展開'}">
                    ${isExpanded ? '▲' : '▼'}
                </button>
            </div>
        </div>
        <div class="note-content ${isExpanded ? 'expanded' : ''}" id="content-${note.id}">
            ${note.content}
        </div>
        <div class="note-tags">
            ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
    
    return noteDiv;
}

function toggleNote(noteId) {
    const contentElement = document.getElementById(`content-${noteId}`);
    if (!contentElement) return;
    
    const noteCard = contentElement.closest('.note-card');
    const expandBtn = noteCard.querySelector('.expand-btn');
    
    if (expandedNotes.has(noteId)) {
        // Collapse
        expandedNotes.delete(noteId);
        contentElement.classList.remove('expanded');
        expandBtn.innerHTML = '▼';
        expandBtn.title = '展開';
    } else {
        // Expand
        expandedNotes.add(noteId);
        contentElement.classList.add('expanded');
        expandBtn.innerHTML = '▲';
        expandBtn.title = '收起';
    }
}

async function copyNote(noteId) {
    const currentCategoryData = notesData.categories.find(cat => cat.id === currentCategory);
    if (!currentCategoryData) return;
    
    const note = currentCategoryData.notes.find(n => n.id === noteId);
    
    if (note) {
        const textToCopy = `${note.title}\n\n${note.content}\n\nTags: ${note.tags.join(', ')}`;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            showCopySuccess();
        } catch (err) {
            console.error('Failed to copy: ', err);
            showCopySuccess(); // Still show success for user feedback
        }
    }
}

function showCopySuccess() {
    if (!copyModal) return;
    
    copyModal.classList.remove('hidden');
    
    setTimeout(() => {
        copyModal.classList.add('hidden');
    }, 2000);
}

function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

function handleKeyboard(event) {
    // Ctrl/Cmd + F to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to clear search
    if (event.key === 'Escape') {
        if (document.activeElement === searchInput) {
            searchInput.value = '';
            handleSearch('');
            searchInput.blur();
        }
    }
    
    // Number keys for tab switching
    const numberKey = parseInt(event.key);
    if (numberKey >= 1 && numberKey <= 4 && tabButtons) {
        const tabButton = tabButtons[numberKey - 1];
        if (tabButton) {
            tabButton.click();
        }
    }
}

// Touch gesture support for mobile
let touchStartY = 0;

function handleTouchStart(event) {
    touchStartY = event.changedTouches[0].screenY;
}

function handleTouchEnd(event) {
    const touchEndY = event.changedTouches[0].screenY;
    const diff = touchStartY - touchEndY;
    const swipeThreshold = 50;
    
    // Add swipe logic if needed for mobile navigation
    if (Math.abs(diff) > swipeThreshold) {
        // Could implement tab switching on swipe
    }
}

// Add touch event listeners for mobile devices
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
}

// Add ripple effect for button interactions
document.addEventListener('click', function(e) {
    const button = e.target.closest('.tab-btn, .copy-btn, .expand-btn, .note-title');
    if (button) {
        createRippleEffect(button, e);
    }
});

function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 212, 255, 0.6);
        pointer-events: none;
        width: 20px;
        height: 20px;
        left: ${x - 10}px;
        top: ${y - 10}px;
        animation: ripple 0.6s linear;
        z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Add ripple animation CSS
const rippleCSS = `
@keyframes ripple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);