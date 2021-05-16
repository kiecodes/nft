const colorSchemes = require("./color_schemes.js")
const { dateString, dec2bin, stringToBinary } = require("./utils.js")
const { fonts } = require("./fonts.js")

colors = colorSchemes[1]

function generateSVG(tokenId, year, month, day, color) {

    colors = colorSchemes[color];

    return generateCardSVG(() => {
        return `
        ${generateCirlceBgSVG(year)}
        ${generateDateStringSVG(year, month, day)}
        ${generateDaySVG(day)}
        ${generateBarcodeSVG(year, month, day)}
        ${generateTokenIdSVG(tokenId)}
        ${generateYearCircleSVG(year)}
        ${generateMonthSVG(month, false, 180, 0.25, "30s", 0.5)}
        ${generateMonthSVG(month, false, 90, 0.5, "15s", 0.7)}
        ${generateMonthSVG(month)}
        `
    })
}

function generateCardSVG(inside) {
    return `
        <svg viewBox="0 0 350 350" width="350px" height="350px" xmlns="http://www.w3.org/2000/svg">
        <defs>
        ${fonts}
        <linearGradient gradientUnits="userSpaceOnUse" x1="175" y1="25" x2="175" y2="325" id="gradient-1" gradientTransform="matrix(0.709142, -0.705066, 0.957551, 0.963086, -117.130104, 129.28929)">
            <stop offset="0" style="stop-color: ${colors.background}"/>
            <stop offset="1" style="stop-color: ${colors.background_darker};"/>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" x1="175" y1="25" x2="175" y2="325" id="gradient-0">
            <stop offset="0" style="stop-color: ${colors.paper_stroke_bright};"/>
            <stop offset="1" style="stop-color: ${colors.paper_stroke_dark};"/>
        </linearGradient>
        <filter id="drop-shadow-filter-0" x="-500%" y="-500%" width="1000%" height="1000%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="7"/>
            <feOffset dx="0" dy="0"/>
            <feComponentTransfer result="offsetblur">
            <feFuncA id="spread-ctrl" type="linear" slope="0.38"/>
            </feComponentTransfer>
            <feFlood flood-color="rgba(0,0,0,1)"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <linearGradient id="color-0">
            <stop style="stop-color: ${colors.foreground};"/>
        </linearGradient>
        </defs>
        <mask id="outerMask">
            <rect style="fill: black;" x="0" y="0" width="350" height="350"/>
            <rect style="fill: white;" x="25" y="25" width="300" height="300" rx="10" ry="10"/>
        </mask>

        <mask id="innerMask">
            <rect style="fill: black;" x="0" y="0" width="350" height="350"/>
            <rect style="fill: white;" x="35" y="35" width="280" height="280" rx="4" ry="4"/>
            <rect x="0" y="233" width="350" height="117" style="fill: black;"/>
        </mask>

        <rect style="paint-order: fill; filter: url(#drop-shadow-filter-0); vector-effect: non-scaling-stroke; stroke: url(#gradient-0); stroke-width: 1.25px; stroke-opacity: 0.61; fill: url(#gradient-1); pointer-events: none;" x="25" y="25" width="300" height="300" rx="10" ry="10"/>
        <rect style="fill: none; stroke: url(#color-0); stroke-width: 1.5px;" x="32.5" y="32.5" width="285" height="285" rx="5" ry="5"/>
        ${inside()}
    </svg>
    `
}

function generateBarcodeSVG(year, month, day) {
    let str = dateString(year, month, day)
    let binary = stringToBinary(str).split("")

    let barWidth = 260/binary.length
    let binaryStartsWith = binary.shift(0)

    let condensed = []
    let counter = 1
    let last = binaryStartsWith
    while (binary.length > 0) {
        let current = binary.shift(0)
        if (current !== last) {
            condensed.push(counter)
            last = current
            counter = 1
        } else {
            counter++;
        }
    }
    condensed.push(counter)

    let result = '<mask id="barcodeMask"><rect x="32.5" y="233" width="285" height="35" style="fill: white;"/>\n'

    let offset = 0
    let high = binaryStartsWith === '1'
    for (let i=0; i<condensed.length; i++) {
        c = condensed[i]
        if (high) {
            result += `<rect x="${45 + offset*barWidth}" y="233" width="${c*barWidth}" height="35" style="fill: black;"/>\n`   
        } 
        offset += c
        high = !high
    }
    result += '</mask><rect x="32.5" y="235" width="285" height="32" style="fill: url(#color-0);" mask="url(#barcodeMask)"/>\n'

    return result
}

function generateDateStringSVG(year, month, day) {
    return `<text 
                style="
                    fill: url(#color-0); 
                    font-family: 'IBM Plex Mono'; 
                    font-size: 28px; 
                    font-weight: 500;"
                x="49.002" 
                y="303">
                ${dateString(year, month, day)}
            </text>`
}

function generateTokenIdSVG(tokenId) {
    return `
        <text 
            transform="matrix(0, 1, -1, 0, 364.27713, -56.049316)" 
            style="
                fill: ${colors.background_darker}; 
                font-family: 'Roboto Slab'; 
                font-size: 6px; 
                font-weight: 300;"
                x="293" 
                y="55"
        >#${tokenId.padStart(7, "0")}</text>
    `
}

function generateMonthSVG(month, filled=true, offset=0, opacity=1, duration="10s", scale=0.8, radius=80, center_x=175, center_y=133) {
    let style = filled ? `fill: url(#color-0); opacity: ${opacity};` : `stroke: url(#color-0); fill: none; opacity: ${opacity};`

    let result = ""

    if (month == 1 || month == 2 || month == 5 || month == 6 || month == 7 || month == 12) {
        // top
        result += `
            <g transform="matrix(${scale}, 0, 0, ${scale}, 0, -${radius})">
                <path d="M -1.5 -8.5 Q 0 -10.5 1.5 -8.5 L 13.5 7.5 Q 15 9.5 12 9.5 L -12 9.5 Q -15 9.5 -13.5 7.5 Z" data-bx-shape="triangle -15 -10.5 30 20 0.5 0.1 1@fb5b0bef" style="${style}" data-bx-origin="0.5 0.5"></path>
            </g>
        `
    }

    if (month == 2 || month == 8 || month == 9 || month == 10 || month == 11 || month == 12) {
        // bottom
        result += `
            <g transform="matrix(-${scale}, 0, 0, -${scale}, 0, ${radius})">
                <path d="M -1.5 -8.5 Q 0 -10.5 1.5 -8.5 L 13.5 7.5 Q 15 9.5 12 9.5 L -12 9.5 Q -15 9.5 -13.5 7.5 Z" data-bx-shape="triangle -15 -10.5 30 20 0.5 0.1 1@fb5b0bef" style="${style}" data-bx-origin="0.5 0.5"></path>
            </g>
        `
    }

    if (month == 3 || month == 4 || month == 5 || month == 7 || month == 10 || month == 11 || month == 12) {
        // right
        result += `
            <g transform="matrix(0, ${scale}, -${scale}, 0, ${radius}, 0)">
                <path d="M -1.5 -8.5 Q 0 -10.5 1.5 -8.5 L 13.5 7.5 Q 15 9.5 12 9.5 L -12 9.5 Q -15 9.5 -13.5 7.5 Z" data-bx-shape="triangle -15 -10.5 30 20 0.5 0.1 1@fb5b0bef" style="${style}" data-bx-origin="0.5 0.5"></path>
            </g>
        `
    }

    if (month == 4 || month == 6 || month == 7 || month == 9 || month == 10 || month == 11 || month == 12) {
        // left
        result += `
            <g transform="matrix(0, -${scale}, ${scale}, 0, -${radius}, 0)">
                <path d="M -1.5 -8.5 Q 0 -10.5 1.5 -8.5 L 13.5 7.5 Q 15 9.5 12 9.5 L -12 9.5 Q -15 9.5 -13.5 7.5 Z" data-bx-shape="triangle -15 -10.5 30 20 0.5 0.1 1@fb5b0bef" style="${style}" data-bx-origin="0.5 0.5"></path>
            </g>
        `
    }

    return `
    <g transform="matrix(1, 0, 0, 1, ${center_x}, ${center_y})">
        <g>
            ${result}
            <animateTransform attributeName="transform"
                              attributeType="XML"
                              type="rotate"
                              from="${offset} 0 0"
                              to="${-360+offset} 0 0"
                              dur="${duration}"
                              repeatCount="indefinite"/>
        </g>
    </g>
    `
}

function generateYearCircleSVG(year, radius=60, center_x=175, center_y=133, resolution=100) {

    let points = []
    for (let i=0; i<resolution; i++) {
        points.push(
            {
                x: radius * Math.cos(Math.PI*2*11/12/resolution*i),
                y: radius * Math.sin(Math.PI*2*11/12/resolution*i)
            }
        )
    }

    let start = points.shift()
    let path = `M ${start.x} ${start.y} `
    while(points.length > 0) {
        let next = points.shift()
        path += `L ${next.x} ${next.y} `
    }

    let yearPositions = []
    for (let i=1; i<=12; i++) {
        yearPositions.push(
            {
                x: radius * Math.cos(Math.PI*2/12*i),
                y: radius * Math.sin(Math.PI*2/12*i)
            }
        )
    }

    let yearBinary = dec2bin(year).padStart(12, '0').split("").reverse().join("")

    let circles = ""
    for (let i=0; i<yearPositions.length; i++) {
        if (yearBinary[i] === '1') {
            circles += `<circle style="fill: url(#color-0);" cx="${yearPositions[i].x}" cy="${yearPositions[i].y}" r="5" />\n`
        } else {
            circles += `<circle style="fill: ${colors.background}; stroke: url(#color-0);" cx="${yearPositions[i].x}" cy="${yearPositions[i].y}" r="2" />\n`
        }
    }

    return `
    <g transform="matrix(1, 0, 0, 1, ${center_x}, ${center_y})">
        <g>
            <g transform="matrix(0, -1, 1, 0, 0, 0)">
                <path d="${path}" style="stroke: url(#color-0); fill: none;"/>
            </g>
        </g>
        <g>
            <g transform="matrix(0, -1, 1, 0, 0, 0)">${circles}</g>
            <animateTransform attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="15s"
                repeatCount="indefinite"/>
        </g>
    </g>
    `
}

function generateDaySVG(day, center_x=175, center_y=133) {

    let dayBinary = dec2bin(day).padStart(5).split("").reverse().join("")

    let result = ""

    if (dayBinary[0] === '1') {
        result += `
            <g>
                <rect style="fill: url(#color-0);" x="-8.5" y="-8.5" width="17" height="17" rx="2" ry="2" />
                <animate
                    attributeType="XML"
                    attributeName="opacity"
                    values="0.5;1.0;1.0;1.0;1.0;1.0;1.0"
                    dur="2.5s"
                    calcMode="discrete"
                    repeatCount="indefinite"/>
            </g>
        `
    }

    if (dayBinary[1] === '1') {
        result += `
            <g transform="matrix(1, 0, 0, 1, 0, -23)">
                <rect style="fill: url(#color-0);" x="-8.5" y="-8.5" width="17" height="17" rx="2" ry="2" />
                <animate
                    attributeType="XML"
                    attributeName="opacity"
                    values="0.5;0.5;1.0;1.0;1.0;1.0;1.0"
                    dur="2.5s"
                    calcMode="discrete"
                    repeatCount="indefinite"/>
            </g>
        `
    }

    if (dayBinary[2] === '1') {
        result += `
            <g transform="matrix(1, 0, 0, 1, 0, 23)">
                <rect style="fill: url(#color-0);" x="-8.5" y="-8.5" width="17" height="17" rx="2" ry="2" />
                <animate
                    attributeType="XML"
                    attributeName="opacity"
                    values="0.5;0.5;0.5;1.0;1.0;1.0;1.0"
                    dur="2.5s"
                    calcMode="discrete"
                    repeatCount="indefinite"/>
            </g>
        `
    }

    if (dayBinary[3] === '1') {
        result += `
            <g transform="matrix(1, 0, 0, 1, 23, 0)">
                <rect style="fill: url(#color-0);" x="-8.5" y="-8.5" width="17" height="17" rx="2" ry="2" />
                <animate
                    attributeType="XML"
                    attributeName="opacity"
                    values="0.5;0.5;0.5;0.5;1.0;1.0;1.0"
                    dur="2.5s"
                    calcMode="discrete"
                    repeatCount="indefinite"/>
            </g>
        `
    }

    if (dayBinary[4] === '1') {
        result += `
            <g transform="matrix(1, 0, 0, 1, -23, 0)">
                <rect style="fill: url(#color-0);" x="-8.5" y="-8.5" width="17" height="17" rx="2" ry="2" />
                <animate
                    attributeType="XML"
                    attributeName="opacity"
                    values="0.5;0.5;0.5;0.5;0.5;1.0;1.0"
                    dur="2.5s"
                    calcMode="discrete"
                    repeatCount="indefinite"/>
            </g>
        `
    }

    return `
        <g transform="matrix(1, 0, 0, 1, ${center_x}, ${center_y})">
            <g transform="matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)">
                <g><rect style="fill: none; stroke: url(#color-0);" x="-10" y="-10" width="20" height="20" rx="3" ry="3"></rect></g>
                <g transform="matrix(1, 0, 0, 1, 0, -23)"><rect style="fill: none; stroke: url(#color-0);" x="-10" y="-10" width="20" height="20" rx="3" ry="3"></rect></g>
                <g transform="matrix(1, 0, 0, 1, 0, 23)"><rect style="fill: none; stroke: url(#color-0);" x="-10" y="-10" width="20" height="20" rx="3" ry="3"></rect></g>
                <g transform="matrix(1, 0, 0, 1,-23, 0)"><rect style="fill: none; stroke: url(#color-0);" x="-10" y="-10" width="20" height="20" rx="3" ry="3"></rect></g>
                <g transform="matrix(1, 0, 0, 1, 23, 0)"><rect style="fill: none; stroke: url(#color-0);" x="-10" y="-10" width="20" height="20" rx="3" ry="3"></rect></g>
                ${result}
            </g>
        </g>
    `
}

function generateCirlceBgSVG(year, center_x=175, center_y=133, from=95, distance=10, num=12) {

    let result = ""

    let yearBinary = dec2bin(year).padStart(12, '0').split("").reverse().join("")


    for (i=0; i<num; i++) {
        let hot = yearBinary[i] == '1'
        result += `<circle r="${from + i*distance}" style="fill: none; stroke: url(#color-0); stroke-width: ${ hot ? 0.6 : 0.3 }; opacity: ${ hot ? 0.5 : 0.2 };"/>\n`
        distance = distance * 0.965
    }

    return `
        <g mask="url(#innerMask)">
            <g transform="matrix(1, 0, 0, 1, ${center_x}, ${center_y})">
                ${result}
            </g>
        </g>
    `
}

module.exports = { generateSVG }