// Mock Telegram WebApp API for local development
window.Telegram = {
    WebApp: {
        ready: function() { 
            console.log('Telegram WebApp is ready'); 
        },
        expand: function() { 
            console.log('Expanding WebApp'); 
        },
        close: function() { 
            console.log('Closing WebApp'); 
        },
        MainButton: {
            text: 'Fechar',
            show: function() { 
                console.log('Show main button'); 
            },
            hide: function() { 
                console.log('Hide main button'); 
            },
            onClick: function(callback) { 
                console.log('Main button click handler set'); 
            }
        },
        BackButton: {
            show: function() { 
                console.log('Show back button'); 
            },
            hide: function() { 
                console.log('Hide back button'); 
            },
            onClick: function(callback) { 
                console.log('Back button click handler set'); 
            }
        },
        HapticFeedback: {
            impactOccurred: function(style) { 
                console.log('Haptic feedback:', style); 
            },
            notificationOccurred: function(type) { 
                console.log('Haptic notification:', type); 
            },
            selectionChanged: function() { 
                console.log('Haptic selection changed'); 
            }
        }
    }
};

// Initialize Telegram WebApp when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram && window.Telegram.WebApp) {
        // Set theme parameters
        window.Telegram.WebApp.themeParams = {
            bg_color: '#ffffff',
            text_color: '#000000',
            hint_color: '#999999',
            link_color: '#2481cc',
            button_color: '#667eea',
            button_text_color: '#ffffff'
        };
        
        // Initialize WebApp
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        
        console.log('Telegram WebApp initialized successfully');
    } else {
        console.log('Running outside Telegram - using mock configuration');
    }
});
