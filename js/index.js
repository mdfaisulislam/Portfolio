        document.addEventListener('DOMContentLoaded', () => {
            const interestsList = document.getElementById('interestsList');
            const scrollToTopBtn = document.getElementById('scrollToTopBtn');
            const colorOptionBtns = document.querySelectorAll('.color-option-btn');
            const fontOptionBtns = document.querySelectorAll('.font-option-btn');
            const predefinedFontsGrid = document.getElementById('predefinedFontsGrid');
            const gradientStartColorPicker = document.getElementById('gradientStartColorPicker');
            const gradientEndColorPicker = document.getElementById('gradientEndColorPicker');
            const applyGradientBtn = document.getElementById('applyGradientBtn');
            const solidColorPicker = document.getElementById('solidColorPicker');
            const applySolidColorBtn = document.getElementById('applySolidColorBtn');
            const resetThemeBtn = document.getElementById('resetThemeBtn');

            const profilePic = document.getElementById('profilePic');
            const profilePicUrlInput = document.getElementById('profilePicUrlInput');
            const applyProfilePicBtn = document.getElementById('applyProfilePicBtn');
            const defaultProfilePicUrl = 'https://placehold.co/160x160/4a00e0/ffffff?text=Me';

            const portfolioLogo = document.getElementById('portfolioLogo');
            const logoUrlInput = document.getElementById('logoUrlInput');
            const applyLogoUrlBtn = document.getElementById('applyLogoUrlBtn');
            const defaultLogoUrl = 'https://placehold.co/55x55/8e2de2/ffffff?text=Logo';

            const fontFamilyInput = document.getElementById('fontFamilyInput');
            const applyFontBtn = document.getElementById('applyFontBtn');

            const layoutEditorToggleBtn = document.getElementById('layoutEditorToggleBtn');
            const layoutToggleText = document.getElementById('layoutToggleText');
            const draggableContainer = document.getElementById('draggableContainer'); 
            let isLayoutEditMode = false;
            let draggedItem = null;

            const customToggleBtn = document.getElementById('customToggleBtn');
            const customizationPanel = document.getElementById('customizationPanel');

            const hamburgerMenu = document.getElementById('hamburgerMenu');
            const mainNavbar = document.getElementById('mainNavbar');


            function adjustHexColor(hex, percent) {
                let f = parseInt(hex.slice(1), 16),
                    t = percent < 0 ? 0 : 255,
                    p = percent < 0 ? percent * -1 : percent,
                    R = f >> 16,
                    G = (f >> 8) & 0x00ff,
                    B = f & 0x0000ff;
                return "#" +
                    (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 +
                        (Math.round((t - G) * p) + G) * 0x100 +
                        (Math.round((t - B) * p) + B))
                    .toString(16)
                    .slice(1);
            }

            function getLuminance(hexColor) {
                const r = parseInt(hexColor.slice(1, 3), 16);
                const g = parseInt(hexColor.slice(3, 5), 16);
                const b = parseInt(hexColor.slice(5, 7), 16);

                return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            }

            function isLightColor(hexColor) {
                return getLuminance(hexColor) > 0.5;
            }

            function applyCustomGradientTheme(startColor, endColor) {
                document.documentElement.classList.remove('theme-default', 'theme-green', 'theme-orange', 'theme-dark');
                
                document.documentElement.style.setProperty('--background-start', startColor);
                document.documentElement.style.setProperty('--background-end', endColor);
                
                if (isLightColor(startColor)) {
                    document.documentElement.style.setProperty('--primary-color', '#333333');
                    document.documentElement.style.setProperty('--secondary-color', '#666666');
                    document.documentElement.style.setProperty('--accent-color', adjustHexColor(startColor, -0.3));
                } else {
                    document.documentElement.style.setProperty('--primary-color', '#ffffff');
                    document.documentElement.style.setProperty('--secondary-color', '#d0d0d0');
                    document.documentElement.style.setProperty('--accent-color', adjustHexColor(startColor, 0.2));
                }

                colorOptionBtns.forEach(btn => btn.classList.remove('active'));
            }

            function applySolidColorTheme(color) {
                document.documentElement.classList.remove('theme-default', 'theme-green', 'theme-orange', 'theme-dark');
                
                document.documentElement.style.setProperty('--background-start', color);
                document.documentElement.style.setProperty('--background-end', color);
                if (isLightColor(color)) {
                    document.documentElement.style.setProperty('--primary-color', '#333333');
                    document.documentElement.style.setProperty('--secondary-color', '#666666');
                    document.documentElement.style.setProperty('--accent-color', adjustHexColor(color, -0.3));
                } else {
                    document.documentElement.style.setProperty('--primary-color', '#ffffff');
                    document.documentElement.style.setProperty('--secondary-color', '#d0d0d0');
                    document.documentElement.style.setProperty('--accent-color', adjustHexColor(color, 0.2));
                }
                colorOptionBtns.forEach(btn => btn.classList.remove('active'));
            }

            function applyTheme(themeName) {
                document.documentElement.style.removeProperty('--background-start');
                document.documentElement.style.removeProperty('--background-end');
                document.documentElement.style.removeProperty('--primary-color');
                document.documentElement.style.removeProperty('--secondary-color');
                document.documentElement.style.removeProperty('--accent-color');

                document.documentElement.classList.remove('theme-default', 'theme-green', 'theme-orange', 'theme-dark');
                
                if (themeName !== 'default') {
                    document.documentElement.classList.add(`theme-${themeName}`);
                } else {
                    document.documentElement.style.setProperty('--primary-color', '#333333');
                    document.documentElement.style.setProperty('--secondary-color', '#666666');
                    document.documentElement.style.setProperty('--accent-color', '#998b83');
                    document.documentElement.style.setProperty('--background-start', '#dac6bb');
                    document.documentElement.style.setProperty('--background-end', '#f6f6f4');
                }

                colorOptionBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.theme === themeName) {
                        btn.classList.add('active');
                    }
                });
            }

            function applyFontFamily(fontFamily) {
                document.documentElement.style.setProperty('--base-font-family', fontFamily);
                fontFamilyInput.value = fontFamily;
                
                fontOptionBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.font === fontFamily) {
                        btn.classList.add('active');
                    }
                });
            }


            function saveLayoutOrder() {
                const sectionOrder = Array.from(draggableContainer.children)
                                        .filter(child => child.classList.contains('glass-card'))
                                        .map(section => section.id);
                localStorage.setItem('portfolioLayoutOrder', JSON.stringify(sectionOrder));
            }

            function loadLayoutOrder() {
                const savedOrder = localStorage.getItem('portfolioLayoutOrder');
                if (savedOrder) {
                    const sectionIds = JSON.parse(savedOrder);
                    const sections = {};
                    Array.from(draggableContainer.children)
                         .filter(child => child.classList.contains('glass-card'))
                         .forEach(section => {
                            sections[section.id] = section;
                         });

                    Array.from(draggableContainer.children).forEach(child => {
                        if (child.classList.contains('glass-card')) {
                            draggableContainer.removeChild(child);
                        }
                    });

                    sectionIds.forEach(id => {
                        if (sections[id]) {
                            draggableContainer.appendChild(sections[id]);
                        }
                    });
                }
            }

            applyTheme('default');
            applyFontFamily("'Poppins', sans-serif");
            loadLayoutOrder();




            window.addEventListener('scroll', () => {
                if (window.scrollY > 200) {
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                }
            });

            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth' 
                });
            });

            customToggleBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                customizationPanel.classList.toggle('open');
            });

            document.addEventListener('click', (event) => {
                if (!customizationPanel.contains(event.target) && !customToggleBtn.contains(event.target)) {
                    customizationPanel.classList.remove('open');
                }
                if (mainNavbar.classList.contains('open') && !mainNavbar.contains(event.target) && !hamburgerMenu.contains(event.target)) {
                    mainNavbar.classList.remove('open');
                    hamburgerMenu.classList.remove('open');
                }
            });

            colorOptionBtns.forEach(button => {
                button.addEventListener('click', (event) => {
                    const theme = event.target.dataset.theme;
                    applyTheme(theme);
                    customizationPanel.classList.remove('open');
                });
            });

            applyGradientBtn.addEventListener('click', () => {
                const selectedColor1 = gradientStartColorPicker.value;
                const selectedColor2 = gradientEndColorPicker.value;
                applyCustomGradientTheme(selectedColor1, selectedColor2);
                customizationPanel.classList.remove('open');
            });

            applySolidColorBtn.addEventListener('click', () => {
                const selectedColor = solidColorPicker.value;
                applySolidColorTheme(selectedColor);
                customizationPanel.classList.remove('open');
            });

            resetThemeBtn.addEventListener('click', () => {
                applyTheme('default');
                gradientStartColorPicker.value = '#8EC5FC';
                gradientEndColorPicker.value = '#E0C3FC';
                solidColorPicker.value = '#FFFFFF';
                applyFontFamily("'Poppins', sans-serif"); 
                customizationPanel.classList.remove('open');
            });

            applyProfilePicBtn.addEventListener('click', () => {
                const imageUrl = profilePicUrlInput.value.trim();
                if (imageUrl) {
                    profilePic.src = imageUrl;
                    profilePic.onerror = () => {
                        profilePic.src = defaultProfilePicUrl;
                        console.error('Failed to load image from URL. Reverting to default.');
                    };
                } else {
                    profilePic.src = defaultProfilePicUrl;
                }
                customizationPanel.classList.remove('open');
            });

            applyLogoUrlBtn.addEventListener('click', () => {
                const imageUrl = logoUrlInput.value.trim();
                if (imageUrl) {
                    portfolioLogo.src = imageUrl;
                    portfolioLogo.onerror = () => {
                        portfolioLogo.src = defaultLogoUrl;
                        console.error('Failed to load logo image from URL. Reverting to default.');
                    };
                } else {
                    portfolioLogo.src = defaultLogoUrl;
                }
                customizationPanel.classList.remove('open');
            });

            applyFontBtn.addEventListener('click', () => {
                const newFont = fontFamilyInput.value.trim();
                if (newFont) {
                    applyFontFamily(newFont);
                } else {
                    applyFontFamily("'Poppins', sans-serif");
                }
                predefinedFontsGrid.classList.remove('show-grid');
                customizationPanel.classList.remove('open');
            });

            fontOptionBtns.forEach(button => {
                button.addEventListener('click', (event) => {
                    const font = event.target.dataset.font;
                    applyFontFamily(font);
                    predefinedFontsGrid.classList.remove('show-grid');
                    customizationPanel.classList.remove('open');
                });
            });

            fontFamilyInput.addEventListener('input', () => {
                const inputValue = fontFamilyInput.value.toLowerCase();
                predefinedFontsGrid.classList.add('show-grid');

                fontOptionBtns.forEach(button => {
                    const fontName = button.dataset.font.toLowerCase();
                    if (fontName.includes(inputValue)) {
                        button.style.display = '';
                    } else {
                        button.style.display = 'none';
                    }
                });
            });

            fontFamilyInput.addEventListener('focus', () => {
                predefinedFontsGrid.classList.add('show-grid');
                if (fontFamilyInput.value.trim() === '') {
                    fontOptionBtns.forEach(button => {
                        button.style.display = '';
                    });
                }
            });

            fontFamilyInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!predefinedFontsGrid.contains(document.activeElement)) {
                        predefinedFontsGrid.classList.remove('show-grid');
                    }
                }, 100);
            });


            layoutEditorToggleBtn.addEventListener('click', () => {
                isLayoutEditMode = !isLayoutEditMode;
                draggableContainer.classList.toggle('layout-edit-mode', isLayoutEditMode);
                layoutEditorToggleBtn.classList.toggle('active', isLayoutEditMode);
                layoutToggleText.textContent = isLayoutEditMode ? 'Disable Layout Editing' : 'Enable Layout Editing';

                const sections = Array.from(draggableContainer.children).filter(child => child.classList.contains('glass-card'));
                sections.forEach(section => {
                    section.draggable = isLayoutEditMode;
                });

                if (!isLayoutEditMode) {
                    saveLayoutOrder();
                }
                customizationPanel.classList.remove('open');
            });

            draggableContainer.addEventListener('dragstart', (e) => {
                if (isLayoutEditMode && e.target.classList.contains('glass-card')) {
                    draggedItem = e.target;
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', draggedItem.id);
                    setTimeout(() => {
                        draggedItem.classList.add('dragging');
                    }, 0);
                }
            });

            draggableContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (isLayoutEditMode && e.target.classList.contains('glass-card') && e.target !== draggedItem) {
                    const targetItem = e.target;
                    const bounding = targetItem.getBoundingClientRect();
                    const offset = bounding.y + (bounding.height / 2);

                    if (e.clientY - offset > 0) {
                        targetItem.classList.remove('drag-over-top');
                        targetItem.classList.add('drag-over-bottom');
                    } else {
                        targetItem.classList.remove('drag-over-bottom');
                        targetItem.classList.add('drag-over-top');
                    }
                    e.dataTransfer.dropEffect = 'move';
                }
            });

            draggableContainer.addEventListener('dragleave', (e) => {
                if (isLayoutEditMode && e.target.classList.contains('glass-card')) {
                    e.target.classList.remove('drag-over-top', 'drag-over-bottom');
                }
            });

            draggableContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                if (isLayoutEditMode && e.target.classList.contains('glass-card') && e.target !== draggedItem) {
                    const targetItem = e.target;
                    targetItem.classList.remove('drag-over-top', 'drag-over-bottom');

                    if (targetItem.classList.contains('drag-over-bottom')) {
                        draggableContainer.insertBefore(draggedItem, targetItem.nextSibling);
                    } else {
                        draggableContainer.insertBefore(draggedItem, targetItem);
                    }
                    saveLayoutOrder();
                }
            });

            draggableContainer.addEventListener('dragend', (e) => {
                if (draggedItem) {
                    draggedItem.classList.remove('dragging');
                    draggedItem = null;
                }
                Array.from(draggableContainer.children).forEach(child => {
                    if (child.classList.contains('glass-card')) {
                        child.classList.remove('drag-over-top', 'drag-over-bottom');
                    }
                });
            });

            hamburgerMenu.addEventListener('click', () => {
                hamburgerMenu.classList.toggle('open');
                mainNavbar.classList.toggle('open');
            });
            mainNavbar.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (mainNavbar.classList.contains('open')) {
                        mainNavbar.classList.remove('open');
                        hamburgerMenu.classList.remove('open');
                    }
                });
            });
        });