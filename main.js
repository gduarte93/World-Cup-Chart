let state = {
    unit: 'cm'
}

function getCountries() {
    return fetch('staticAPI/wc/2018/teams.json')
            .then((res) => res.json())
            .then((dataArray) => {
                return dataArray.map((data) => {
                    return ({
                        name: data.team.name,
                        group: data.statistics.seasons[data.statistics.seasons.length - 1].statistics.group_name,
                        color: data.jerseys[0].base,
                        players: data.players,
                        stages: {
                            'Groups': data.team.groups,
                            '16': data.team['16'],
                            '8': data.team['8'],
                            '4': data.team['4'],
                            '2': data.team['2'],
                            'Winner': data.team.winner
                        }
                    });
                });
            })
            .catch((error) => {
                console.log(error);
            });
};

class Point {
    constructor(size, player, stages, color, yMin, yMax, chartHeight) {
        this.size = size;
        this.color = color;
        this.yMin = yMin;
        this.yMax = yMax;
        this.chartHeight = chartHeight;
        this.player = player;
        this.age = Math.abs(new Date(Date.now() - new Date(player.date_of_birth)).getUTCFullYear() - 1970);
        this.el = document.createElement('div');
        
        const inches = (this.player.height * 0.394).toFixed(2),
              feet = `${Math.floor(inches / 12)}'${(Math.floor(inches) % 12)}"`;

        this.playerHeightFT = feet;
        this.stages = stages;
    }

    showPlayerInfo() {
        let card = document.createElement('div'),
            nameWrapper = document.createElement('div'),
            countryWrapper = document.createElement('div'),
            heightWrapper = document.createElement('div'),
            ageWrapper = document.createElement('div'),
            nameLabel = document.createElement('span'),
            countryLabel = document.createElement('span'),
            heightLabel = document.createElement('span'),
            ageLabel = document.createElement('span'),
            name = document.createElement('span'),
            country = document.createElement('span'),
            height = document.createElement('span'),
            age = document.createElement('span');
        
        
        nameLabel.textContent = "Name: ";
        countryLabel.textContent = "Country: ";
        ageLabel.textContent = "Age: ";
        heightLabel.textContent = "Height: ";

        nameLabel.setAttribute('class', 'label');
        countryLabel.setAttribute('class', 'label');
        ageLabel.setAttribute('class', 'label');
        heightLabel.setAttribute('class', 'label');

        name.textContent = this.player.name;
        country.textContent = this.player.country_code;
        height.textContent = state.unit === 'cm' ? this.player.height : this.playerHeightFT;
        age.textContent = this.age;
        
        nameWrapper.appendChild(nameLabel);
        nameWrapper.appendChild(name);
        countryWrapper.appendChild(countryLabel);
        countryWrapper.appendChild(country);
        ageWrapper.appendChild(ageLabel);
        ageWrapper.appendChild(age);
        heightWrapper.appendChild(heightLabel);
        heightWrapper.appendChild(height);

        card.setAttribute('class', 'playerCard');
        nameWrapper.setAttribute('class', 'name');
        countryWrapper.setAttribute('class', 'country');
        ageWrapper.setAttribute('class', 'age');
        heightWrapper.setAttribute('class', 'height');

        card.appendChild(nameWrapper);
        card.appendChild(countryWrapper);
        card.appendChild(ageWrapper);
        card.appendChild(heightWrapper);

        if (this.card === undefined) {
            this.card = card;
            this.el.appendChild(this.card);
            this.el.classList.add('active');
        }
    }

    hidePlayerInfo() {
        if (this.card !== undefined) {
            this.el.classList.remove('active');
            this.el.removeChild(this.card);
            this.card = undefined;
        }
    }

    render() {
        const yDifference = this.yMax - this.yMin,
              multiplier = this.chartHeight / yDifference,
              yPos = ((this.player.height - this.yMin) * multiplier) - (this.size / 2);
        let randomLeftPosition = parseFloat(Math.random() * 100).toFixed(2);

        this.el.classList.add('player-point');
        this.el.setAttribute('height', this.player.height);
        this.el.setAttribute('style',
            `position:absolute;`
            +`width: ${this.size}px;`
            +`height: ${this.size}px;`
            +`background-color: #${this.color};`
            +`border-radius: 100%;`
            +`bottom: ${yPos}px;`
            +`left: ${randomLeftPosition}%;`
            +`opacity: 0.75;`
            +`cursor: pointer;`
            +`border: 1px solid #ddd;`
            +`z-index: 1;`
        );

        this.el.setAttribute('stages', JSON.stringify(this.stages));

        this.el.onmouseenter = () => this.showPlayerInfo();
        this.el.onmouseleave = () => this.hidePlayerInfo();

        return this.el;
    }
}

class UnitSwitcher {

    toggle() {
        if (this.rightSwitch.classList.contains('active-unit')) {
            state.unit = 'ft';
            this.rightSwitch.classList.remove('active-unit');
            this.leftSwitch.classList.add('active-unit');
        } else {
            state.unit = 'cm';
            this.rightSwitch.classList.add('active-unit');
            this.leftSwitch.classList.remove('active-unit');
        }

        this.translateUnits(state.unit);
    }

    translateUnits(unit) {
        Array.from(document.getElementsByClassName('unit')).forEach((el) => {
            el.textContent = unit === 'cm' ? el.getAttribute('cm') : el.getAttribute('ft');
        });
    }

    render() {
        this.unitSwitchWrapper = document.createElement('div'),
        this.leftSwitch = document.createElement('div'),
        this.rightSwitch = document.createElement('div');

        this.unitSwitchWrapper.setAttribute('style',
            `width: 100px;`
            +`height: 40px;`
            +`position: absolute;`
            +`bottom: -40px;`
            +`left: -100px;`
            +`border: 1px solid #888;`
            +`box-sizing: border-box;`
            +`border-radius: 5px;`
            +`line-height: 40px;`
            +`color: #888;`
            +`cursor: pointer;`
        );

        this.leftSwitch.setAttribute('style',
            `height: 100%;`
            +`width: 50%;`
            +`float: left;`
            +`border-right: 1px solid #888;`
            +`box-sizing: inherit;`
        );

        this.rightSwitch.setAttribute('style',
            `height: 100%;`
            +`width: 50%;`
            +`float: right;`
            +`box-sizing: inherit;`
        );

        this.leftSwitch.textContent = 'ft';
        this.rightSwitch.textContent = 'cm';

        if (state.unit === 'cm') {
            this.rightSwitch.setAttribute('class', 'active-unit');
        } else {
            this.leftSwitch.setAttribute('class', 'active-unit');
        }

        this.unitSwitchWrapper.appendChild(this.leftSwitch);
        this.unitSwitchWrapper.appendChild(this.rightSwitch);

        this.unitSwitchWrapper.onclick = () => this.toggle();

        return this.unitSwitchWrapper;
    }
}

// TODO: Recalculate whisker and box when slider changes
class Slider {
    constructor() {
        this.sliderValues = ['Groups', '16', '8', '4', '2', 'Winner'];
    }

    sliderClick(e) {
        let bubbles = document.getElementsByClassName('slider-bubble');
        Array.from(bubbles).forEach((bubble) => {
            if (parseInt(bubble.getAttribute('slider'), 0) <= parseInt(e.target.getAttribute('slider'), 0)) {
                bubble.classList.add('slider-highlighted');
            } else {
                bubble.classList.remove('slider-highlighted');
            }

            if (bubble === e.target) {
                bubble.classList.add('slider-active');
            } else {
                bubble.classList.remove('slider-active');
            }
        });

        const playerPoints = document.getElementsByClassName('player-point');
        Array.from(playerPoints).forEach((player) => {
            if (!JSON.parse(player.getAttribute('stages'))[e.target.getAttribute('value')]) {
                player.style.display = "none";
            } else {
                player.style.display = "block";
            }
        });

        let columns = document.getElementsByClassName('chart-column');

        Array.from(columns).forEach((column) => {
            let oldPlots = Array.from(column.childNodes).filter((node) => node.classList.contains('wb-plot'));
            while(oldPlots.length) {
                oldPlots[0].parentNode.removeChild(oldPlots[0]);
                oldPlots.shift();
            }
            const playerHeights = Array.from(column.childNodes)
                .filter((node) => node.classList.contains('player-point') && node.style.display !== 'none')
                .map((node) => parseInt(node.getAttribute('height'), 10));

            column.appendChild(new wbPlot(playerHeights, state.yMin, state.yMax, state.chartHeight).render());
        });
    }

    render() {
        let slider = document.createElement('div');

        slider.setAttribute('style',
            `position: absolute;`
            +`width: 80%;`
            +`height: 1px;`
            +`bottom: -100px;`
            +`left: 8%;`
        );
        
        let bubble = document.createElement('div');
        bubble.classList.add('slider-bubble');
        bubble.setAttribute('style',
            `width: 30px;`
            +`height: 30px;`
            +`border: 1px solid black;`
            +`border-radius: 100%;`
            +`top: -15px;`
            +`position: absolute;`
            +`cursor: pointer;`
        );

        for (let i = 0; i < this.sliderValues.length; i++) {
            let _bubble = bubble.cloneNode();
            _bubble.style.left = `${i * (100 / (this.sliderValues.length - 1))}%`;
            _bubble.setAttribute('slider', i);
            _bubble.setAttribute('value', this.sliderValues[i]);
            
            if (i === 0) {
                _bubble.classList.add('slider-active');
                _bubble.classList.add('slider-highlighted');
            }

            _bubble.onclick = (e) => this.sliderClick(e);
            
            let label = document.createElement('div');
            label.textContent = this.sliderValues[i];
            label.setAttribute('style',
                `margin-left: -100%;`
                +`margin-right: -100%;`
                +`text-align: center;`
                +`position: relative;`
                +`bottom: -35px;`
            );
            _bubble.appendChild(label);

            slider.appendChild(_bubble);
        }

        return slider;
    }
}

class Title {
    constructor(title) {
        this.title = title;
    }

    render() {
        let title = document.createElement('div');
        title.textContent = this.title;
        title.setAttribute('style',
            `position: absolute;`
            +`top: -50px;`
            +`width: 100%;`
            +`font-size: 18px;`
            +`font-weight: bold;`
        );

        return title;
    }
}

class Chart {
    constructor(width, height, xAxisArray) {
        this.width = width;
        this.height = height;
        this.xAxisArray = xAxisArray;

        state.chartHeight = this.height;
    }

    render() {
        let container = document.createElement('div');
        container.setAttribute('style',
            `width:${this.width}px;`
            +`height:${this.height}px;`
            +`border-style: solid;`
            +`border-color: black;`
            +`border-width: 0 0 1px 1px;`
            +`display: inline-block;`
            +`position: relative;`
        );

        const yMax = Math.ceil(state.maxPlayerHeight / 10) * 10,
              yMin = Math.floor(state.minPlayerHeight / 10) * 10,
              yNumOfLabels = 10,
              yInterval = (yMax - yMin) / yNumOfLabels;
        
        let yAxis = document.createElement('div');
        yAxis.setAttribute('style',
            `width: 10px;`
            +`height: 100%;`
            +`left: -10px;`
            +`position: absolute;`
        );
        
        container.appendChild(yAxis);

        for (let i = 1; i <= yNumOfLabels; i++) {
            let label = yMax - i * yInterval;

            if (i === 1) {
                this.yMax = label;
            }
            if (i === yNumOfLabels) {
                this.yMin = label - yInterval;
            }

            let yDash = document.createElement('div');
            yDash.setAttribute('style',
                `width: 100%;`
                +`height: ${100 / yNumOfLabels}%;`
                +`border-top: 1px solid black;`
            );

            let yLabel = document.createElement('div');
            yLabel.textContent = label;
            yLabel.setAttribute('style',
                `position: relative;`
                +`left: -30px;`
                +`top: -10px;`
            );
            yLabel.setAttribute('cm', label);

            const inches = (label * 0.394).toFixed(2),
                  feet = `${Math.floor(inches / 12)}'${(Math.floor(inches) % 12)}"`;

            yLabel.setAttribute('ft', feet)
            yLabel.setAttribute('class', 'unit')

            yDash.appendChild(yLabel);
            yAxis.appendChild(yDash);
        }

        state.yMin = this.yMin;
        state.yMax = this.yMax;

        this.xAxisArray.forEach((name, index, self) => {
            container.appendChild(new Column(this.width/self.length, name, index, this.height, this.yMin, this.yMax).render());
        });

        container.appendChild(new UnitSwitcher().render());
        container.appendChild(new Slider().render());
        container.appendChild(new Title("Distributions of height by position for each player in the 2018 FIFA World Cup").render());

        return container;
    }
}

class wbPlot {
    constructor(array, yMin, yMax, chartHeight) {
        this.array = array;
        this.yMin = yMin;
        this.yMax = yMax;
        this.chartHeight = chartHeight;
    }

    median(array) {
        array.sort((a, b) => a - b);
        const half = Math.floor(array.length / 2);
        return array.length % 2 ? array[half] : (array[half - 1] + array[half]) / 2.0;
    }

    plots(array) {
        array.sort((a, b) => a - b);
        const half = Math.floor(array.length / 2);
        
        return {
            min: array[0],
            q1: this.median(array.slice(0, half)),
            median: this.median(array),
            q3: array.length % 2 ? this.median(array.slice(half)) : this.median(array.slice(half + 1)),
            max: array[array.length - 1]
        }
    }

    render() {
        const yDifference = this.yMax - this.yMin,
              multiplier = this.chartHeight / yDifference,
              plots = this.plots(this.array);
        
        let wbPlot = document.createElement('div');

        let medianPlot = document.createElement('div'),
            medianYPos = (plots.median - this.yMin) * multiplier;
        medianPlot.setAttribute('style',
            `bottom: ${medianYPos}px;`
            +`width: 100%;`
            +`height: 2px;`
            +`background: black;`
            +`position: absolute;`
        );

        let q1Plot = document.createElement('div'),
            q1YPos = (plots.q1 - this.yMin) * multiplier;
        q1Plot.setAttribute('style',
            `bottom: ${q1YPos}px;`
            +`width: 100%;`
            +`height: ${medianYPos - q1YPos}px;`
            +`position: absolute;`
            +`box-sizing: border-box;`
            +`border-right: 2px solid black;`
            +`border-bottom: 2px solid black;`
            +`border-left: 2px solid black;`
        );

        let q3Plot = document.createElement('div'),
            q3Height = ((plots.q3 - this.yMin) * multiplier) - medianYPos;
        q3Plot.setAttribute('style',
            `bottom: ${medianYPos}px;`
            +`width: 100%;`
            +`height: ${q3Height}px;`
            +`position: absolute;`
            +`box-sizing: border-box;`
            +`border-right: 2px solid black;`
            +`border-top: 2px solid black;`
            +`border-left: 2px solid black;`
        );

        let minPlot = document.createElement('div'),
            minYPos = (plots.min - this.yMin) * multiplier;
        minPlot.setAttribute('style',
            `bottom: ${minYPos}px;`
            +`width: 40%;`
            +`left: 30%;`
            +`height: 2px;`
            +`background: black;`
            +`position: absolute;`
        );

        let maxPlot = document.createElement('div'),
            maxYpos = (plots.max - this.yMin) * multiplier;
        maxPlot.setAttribute('style',
            `bottom: ${maxYpos}px;`
            +`width: 40%;`
            +`left: 30%;`
            +`height: 2px;`
            +`background: black;`
            +`position: absolute;`
        );

        let bottomWhisker = document.createElement('div');
        bottomWhisker.setAttribute('style',
            `bottom: ${minYPos + 2}px;`
            +`height: ${q1YPos - minYPos - 2}px;`
            +`width: 2px;`
            +`background: #666;`
            +`position: absolute;`
            +`left: 48%;`
        );

        let topWhisker = document.createElement('div'),
            topWhiskerYPos = medianYPos + parseInt(q3Plot.style.height, 0);
        topWhisker.setAttribute('style',
            `bottom: ${topWhiskerYPos}px;`
            +`height: ${maxYpos - topWhiskerYPos}px;`
            +`width: 2px;`
            +`background: #666;`
            +`position: absolute;`
            +`left: 48%;`
        );

        wbPlot.appendChild(medianPlot);
        wbPlot.appendChild(q1Plot);
        wbPlot.appendChild(q3Plot);
        wbPlot.appendChild(minPlot);
        wbPlot.appendChild(maxPlot);
        wbPlot.appendChild(bottomWhisker);
        wbPlot.appendChild(topWhisker);

        wbPlot.setAttribute('style',
            'opacity: 0.6;'
            +'z-index: 0;'
        );

        wbPlot.classList.add('wb-plot');

        return wbPlot;
    }
}

class Column {
    constructor(width, name, index, chartHeight, yMin, yMax) {
        this.width = width;
        this.name = name;
        this.index = index;
        this.chartHeight = chartHeight;
        this.yMin = yMin;
        this.yMax = yMax;
    }

    render() {
        let column = document.createElement('div'),
            margin = 50,
            isFirst = this.index === 0;
        column.setAttribute('name', this.name);
        column.classList.add('chart-column');
        column.setAttribute('style',
            `margin-left: ${isFirst ? margin : 0}px;`
            +`margin-right: ${margin}px;`
            +`width: ${isFirst ? this.width - (margin * 2) : this.width - margin}px;`
            +`height: 100%;`
            +`float: left;`
            +`position: relative;`
        );

        let dash = document.createElement('div');
        dash.setAttribute('style',
            `position: absolute;`
            +`width: 1px;`
            +`height: 10px;`
            +`background: black;`
            +`bottom: -10px;`
            +`left: 50%;`
            +`margin-left: -1px;`
        );

        let name = document.createElement('div');
        name.textContent = this.name;
        name.setAttribute('style',
            `position: absolute;`
            +`width: 100%;`
            +`bottom: -30px;`
            +`text-transform: capitalize;`
        );

        column.appendChild(dash);
        column.appendChild(name);
        
        let playerHeights = [];
        state.countries.forEach((country) => {
            country.players.filter((player) => {
                return player.type === this.name;
            }).forEach((player) => {
                playerHeights.push(player.height);
                const point = new Point(
                    10,
                    player,
                    country.stages,
                    country.color,
                    this.yMin,
                    this.yMax,
                    this.chartHeight
                );
                column.appendChild(point.render());
            });
        });

        column.appendChild(new wbPlot(playerHeights, this.yMin, this.yMax, this.chartHeight).render());

        return column;
    }
}

window.onload = async () => {
    state.countries = await getCountries();

    // 201
    state.maxPlayerHeight = state.countries.map((country) => {
        return({
            name: country.name,
            maxHeight: country.players.reduce((acc, curr) =>  {
                return acc.height > curr.height ? acc : curr;
            }).height
        });
    }).reduce((acc, curr) =>  {
        return acc.maxHeight > curr.maxHeight ? acc : curr;
    }).maxHeight;

    // 165
    state.minPlayerHeight = state.countries.map((country) => {
        return({
            name: country.name,
            minHeight: country.players.reduce((acc, curr) =>  {
                return acc.height < curr.height ? acc : curr;
            }).height
        });
    }).reduce((acc, curr) =>  {
        return acc.minHeight < curr.minHeight ? acc : curr;
    }).minHeight;

    const yAxis = ['goalkeeper', 'defender', 'forward', 'midfielder'];
    const chart = new Chart(800, 500, yAxis);

    document.getElementById('chartContainer').appendChild(chart.render());

}