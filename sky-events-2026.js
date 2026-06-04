// sky-events-2026.js
// ========================================
// SPACE TIME WITH ROBERT
// Astronomy Event Database System
// ========================================
// ========================================
// SKY EVENT DATABASE
// Date format:
// YYMMDD
// Example:
// 260812 = August 12, 2026
// ========================================

const SKY_EVENTS_2026 = {

    // ========================================
    // JANUARY
    // ========================================

    "260103": [

        {
            icon: "☄️",
            title: "Quadrantids Meteor Shower Peak",
            type: "meteor-shower",
            importance: 4,
            visibility: "Best before dawn",
            moonImpact: "Low",
            outreachFriendly: true
        }

    ],



    // ========================================
    // MARCH
    // ========================================

    "260314": [

        {
            icon: "🌕",
            title: "Total Lunar Eclipse",
            type: "lunar-eclipse",
            importance: 5,
            visibility: "Visible throughout eclipse",
            moonImpact: "N/A",
            outreachFriendly: true
        }

    ],



    "260320": [

        {
            icon: "🌞",
            title: "March Equinox",
            type: "equinox",
            importance: 3,
            visibility: "All day",
            moonImpact: "N/A",
            outreachFriendly: false
        }

    ],



    // ========================================
    // APRIL
    // ========================================

    "260422": [

        {
            icon: "☄️",
            title: "Lyrids Meteor Shower Peak",
            type: "meteor-shower",
            importance: 3,
            visibility: "Best after midnight",
            moonImpact: "Moderate",
            outreachFriendly: true
        }

    ],



    // ========================================
    // MAY
    // ========================================

    "260506": [

        {
            icon: "☄️",
            title: "Eta Aquariids Meteor Shower Peak",
            type: "meteor-shower",
            importance: 3,
            visibility: "Best before dawn",
            moonImpact: "Low",
            outreachFriendly: true
        }

    ],



    // ========================================
    // JUNE
    // ========================================

    "260621": [

        {
            icon: "🌞",
            title: "June Solstice",
            type: "solstice",
            importance: 3,
            visibility: "All day",
            moonImpact: "N/A",
            outreachFriendly: false
        }

    ],



    // ========================================
    // JULY
    // ========================================

    "260730": [

        {
            icon: "☄️",
            title: "Delta Aquariids Meteor Shower Peak",
            type: "meteor-shower",
            importance: 3,
            visibility: "Best after midnight",
            moonImpact: "Moderate",
            outreachFriendly: true
        }

    ],



    // ========================================
    // AUGUST
    // ========================================

    "260812": [

        {
            icon: "☄️",
            title: "Perseid Meteor Shower Peak",
            type: "meteor-shower",
            importance: 5,
            visibility: "Best after midnight",
            moonImpact: "Moderate",
            outreachFriendly: true
        }

    ],



    "260814": [

        {
            icon: "🪐",
            title: "Saturn at Opposition",
            type: "planet-opposition",
            importance: 4,
            visibility: "Visible all night",
            moonImpact: "Low",
            outreachFriendly: true
        }

    ],



    // ========================================
    // SEPTEMBER
    // ========================================

    "260907": [

        {
            icon: "🌕",
            title: "Total Lunar Eclipse",
            type: "lunar-eclipse",
            importance: 5,
            visibility: "Visible throughout eclipse",
            moonImpact: "N/A",
            outreachFriendly: true
        }

    ],



    "260922": [

        {
            icon: "🌞",
            title: "September Equinox",
            type: "equinox",
            importance: 3,
            visibility: "All day",
            moonImpact: "N/A",
            outreachFriendly: false
        }

    ],



    // ========================================
    // OCTOBER
    // ========================================

    "261021": [

        {
            icon: "☄️",
            title: "Orionids Meteor Shower Peak",
            type: "meteor-shower",
            importance: 3,
            visibility: "Best before dawn",
            moonImpact: "Low",
            outreachFriendly: true
        }

    ],



    // ========================================
    // NOVEMBER
    // ========================================

    "261105": [

        {
            icon: "🪐",
            title: "Jupiter at Opposition",
            type: "planet-opposition",
            importance: 5,
            visibility: "Visible all night",
            moonImpact: "Low",
            outreachFriendly: true
        }

    ],



    "261117": [

        {
            icon: "☄️",
            title: "Leonids Meteor Shower Peak",
            type: "meteor-shower",
            importance: 2,
            visibility: "Best after midnight",
            moonImpact: "Moderate",
            outreachFriendly: true
        }

    ],



    // ========================================
    // DECEMBER
    // ========================================

    "261213": [

        {
            icon: "☄️",
            title: "Geminids Meteor Shower Peak",
            type: "meteor-shower",
            importance: 5,
            visibility: "Visible all night",
            moonImpact: "Low",
            outreachFriendly: true
        }

    ],



    "261221": [

        {
            icon: "🌞",
            title: "December Solstice",
            type: "solstice",
            importance: 3,
            visibility: "All day",
            moonImpact: "N/A",
            outreachFriendly: false
        }

    ],



    "261222": [

        {
            icon: "☄️",
            title: "Ursids Meteor Shower Peak",
            type: "meteor-shower",
            importance: 2,
            visibility: "Best before dawn",
            moonImpact: "Moderate",
            outreachFriendly: true
        }

    ]

};



// ========================================
// SKY EVENT HELPERS
// ========================================

function getSkyEvents(dateKey) {

    return SKY_EVENTS[dateKey] || [];

}



function hasSkyEvents(dateKey) {

    return getSkyEvents(dateKey).length > 0;

}



function getPrimarySkyEventForDate(dateKey) {

    return getPrimarySkyEvent(getSkyEvents(dateKey));

}