// Local projects data - Synced automatically every 12 hours with GitHub API
// Last sync: Manual (initial setup)

const LOCAL_PROJECTS = [
    // Ces données seront automatiquement mises à jour par la sync API
    // Si tu veux ajouter manuellement un projet, suis ce format :
    /*
    {
        name: "nom-du-repo",
        html_url: "https://github.com/Lightshadow02/nom-du-repo",
        description: "Description du projet",
        topics: ["cours"],
        updated_at: "2024-01-01T00:00:00Z"
    }
    */
];

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LOCAL_PROJECTS;
}
