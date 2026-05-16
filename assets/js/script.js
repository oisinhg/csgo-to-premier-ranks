const csgoRanks = [
    // SILVER
    { group: "silver", img: "silver1.svg", percentile: 4.2 },
    { group: "silver", img: "silver2.svg", percentile: 4.28 },
    { group: "silver", img: "silver3.svg", percentile: 4.38 },
    { group: "silver", img: "silver4.svg", percentile: 5.29 },
    { group: "silver", img: "silverE.svg", percentile: 6.57 },
    { group: "silver", img: "silverEM.svg", percentile: 7.74 },

    // GOLD NOVA
    { group: "nova", img: "nova1.svg", percentile: 8.64 },
    { group: "nova", img: "nova2.svg", percentile: 8.8 },
    { group: "nova", img: "nova3.svg", percentile: 8.89 },
    { group: "nova", img: "novaM.svg", percentile: 8.125 },

    // MASTER GUARDIAN
    { group: "mg", img: "mg1.svg", percentile: 7.47 },
    { group: "mg", img: "mg2.svg", percentile: 6.455 },
    { group: "mg", img: "mge.svg", percentile: 5.245 },
    { group: "mg", img: "dmg.svg", percentile: 4.11 },

    // EAGLE & ABOVE
    { group: "eagle", img: "le.svg", percentile: 3.205 },
    { group: "eagle", img: "lem.svg", percentile: 3.195 },
    { group: "eagle", img: "smfc.svg", percentile: 2.625 },
    { group: "global", img: "global.svg", percentile: 0.765 },
];

const cs2Bands = [
    { min: 1000, max: 2000, percentile: 3.7 },
    { min: 2000, max: 3000, percentile: 4.7 },
    { min: 3000, max: 4000, percentile: 6.7 },
    { min: 4000, max: 5000, percentile: 6.1 },
    { min: 5000, max: 6000, percentile: 4.5 },
    { min: 6000, max: 7000, percentile: 4.1 },
    { min: 7000, max: 8000, percentile: 4.5 },
    { min: 8000, max: 9000, percentile: 4.8 },
    { min: 9000, max: 10000, percentile: 6.0 },
    { min: 10000, max: 11000, percentile: 4.7 },
    { min: 11000, max: 12000, percentile: 5.3 },
    { min: 12000, max: 13000, percentile: 5.4 },
    { min: 13000, max: 14000, percentile: 5.2 },
    { min: 14000, max: 15000, percentile: 5.9 },
    { min: 15000, max: 16000, percentile: 4.2 },
    { min: 16000, max: 17000, percentile: 4.1 },
    { min: 17000, max: 18000, percentile: 3.8 },
    { min: 18000, max: 19000, percentile: 3.3 },
    { min: 19000, max: 20000, percentile: 3.4 },
    { min: 20000, max: 21000, percentile: 2.1 },
    { min: 21000, max: 22000, percentile: 1.9 },
    { min: 22000, max: 23000, percentile: 1.5 },
    { min: 23000, max: 24000, percentile: 1.2 },
    { min: 24000, max: 25000, percentile: 1.0 },
    { min: 25000, max: 26000, percentile: 0.6 },
    { min: 26000, max: 27000, percentile: 0.5 },
    { min: 27000, max: 28000, percentile: 0.3 },
    { min: 28000, max: 29000, percentile: 0.1 },
    { min: 29000, max: 30000, percentile: 0.1 },
    { min: 30000, max: null, percentile: 0.1 },
];

function ratingClass(rating) {
    if (rating < 5000) return "rating-grey";
    if (rating < 10000) return "rating-lightblue";
    if (rating < 15000) return "rating-blue";
    if (rating < 20000) return "rating-purple";
    if (rating < 25000) return "rating-pink";
    if (rating < 30000) return "rating-red";
    return "rating-gold";
}

function init() {
    let csgoCumulative = 0;
    const csgoWithCumulative = csgoRanks.map(rank => {
        const lower = csgoCumulative;
        const upper = csgoCumulative + rank.percentile;
        csgoCumulative = upper;
        return { ...rank, cumLower: lower, cumUpper: upper };
    });

    let cs2Cumulative = 0;
    const cs2WithCumulative = cs2Bands.map(band => {
        const lower = cs2Cumulative;
        const upper = cs2Cumulative + band.percentile;
        cs2Cumulative = upper;
        return { ...band, cumLower: lower, cumUpper: upper };
    });

    const csgoMapped = csgoWithCumulative.map(rank => {
        const lowerBand = cs2WithCumulative.find(b => rank.cumLower >= b.cumLower && rank.cumLower < b.cumUpper);
        const upperBand = cs2WithCumulative.find(b => rank.cumUpper > b.cumLower && rank.cumUpper <= b.cumUpper);

        return {
            ...rank,
            cs2min: lowerBand?.min ?? null,
            cs2max: upperBand?.min ?? null,
        };
    });

    csgoMapped.forEach(rank => {
        const tbody = document.getElementById(`tbody-${rank.group}`);
        const row = document.createElement("tr");
        row.classList.add(`row-${rank.group}`);

        const isSingleValue = rank.cs2min === rank.cs2max;
        const minDisplay = rank.cs2min.toLocaleString();
        const maxRating = rank.cs2max ?? 30000;
        const maxDisplay = rank.cs2max ? (rank.cs2max - 1).toLocaleString() : "30,000+";

        row.innerHTML = `
            <td class="rank-icon"><img src="assets/images/${rank.img}"></td>
            <td class="arrow-col">→</td>
            <td class="rating">
                <span class="${ratingClass(rank.cs2min)}">${minDisplay}</span>
                ${isSingleValue ? "" : ` - <span class="${ratingClass(maxRating)}">${maxDisplay}</span>`}
            </td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", init);