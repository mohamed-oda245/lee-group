const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\dell\\Downloads\\Lee Presentation\\lee-group-website\\pages';

// Map HTML files to images
const imageMap = {
    'service-downhole.html': 'unnamed (1).jpeg',
    'service-wireline.html': 'unnamed (2).jpeg',
    'service-inspection.html': 'unnamed (3).jpeg',
    'service-bop.html': 'unnamed (4).jpeg',
    'service-machine-shop.html': 'unnamed (5).jpeg',
    'service-chemical.html': 'Chemical.png',
    'about.html': 'unnamed (6).jpeg',
    'partners.html': 'unnamed (7).jpeg'
};

for (const [file, image] of Object.entries(imageMap)) {
    const fullPath = path.join(dir, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');

        // Wireline remaining emojis
        if (file === 'service-wireline.html') {
            content = content.replace('📊', '<i class="fa-solid fa-chart-column"></i>');
            content = content.replace('💥', '<i class="fa-solid fa-bullseye"></i>');
            content = content.replace('📈', '<i class="fa-solid fa-chart-line"></i>');
            content = content.replace('🔗', '<i class="fa-solid fa-link"></i>');
            content = content.replace('⚡', '<i class="fa-solid fa-bolt"></i>');
        }

        // Insert image
        const imageTag = `\n                <img src="../images/${image}" alt="Lee Group Professional Image" style="width:100%; height:420px; object-fit:cover; border-radius:12px; margin-top:2.5rem; box-shadow: 0 8px 30px rgba(0,0,0,0.15);" class="fade-in">`;

        // Strategy 1: Find container--narrow and insert after the first </p> inside it (for service pages)
        if (file.startsWith('service-')) {
            if (content.includes('container--narrow') && !content.includes(imageTag.trim())) {
                const regex = /(<div class="container--narrow"[^>]*>[\s\S]*?<\/p>)/i;
                content = content.replace(regex, `$1${imageTag}`);
            }
        } else if (file === 'about.html') {
            // In about.html, insert after the story paragraphs
            if (!content.includes(imageTag.trim())) {
                const regex = /(<p class="fade-in" data-i18n="about.story_p4">[\s\S]*?<\/p>)/i;
                content = content.replace(regex, `$1${imageTag}`);
            }
        } else if (file === 'partners.html') {
            if (!content.includes(imageTag.trim())) {
                const regex = /(<p class="fade-in" data-i18n="partners.intro">[\s\S]*?<\/p>)/i;
                content = content.replace(regex, `$1${imageTag}`);
            }
        }

        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
    }
}
