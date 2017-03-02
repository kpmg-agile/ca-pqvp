import {Component, Input} from '@angular/core';
import template from './Dashboard.html';
import styles from './Dashboard.scss';
import Api from '../../../../raml/api.v1.raml';
import moment from 'moment';
import * as d3 from 'd3';

@Component({
    selector: 'dashboard',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <dashboard name="Dashboard" (change)="onChange($event)"></dashboard>
 */
export default class Dashboard {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'Dashboard';

    _api:Api;

    constructor() {
        this._api = new Api();
    }

    contracts:Array = [];
    expenditures:Array = [];
    dataYears:Array = [];

    alertNotImplemented() {
        alert('This functionality is not yet implemented'); // eslint-disable-line

    }

    async ngOnInit() {
        this.contracts = await this._api.contracts.get().json();
        console.log('contracts', JSON.stringify(this.contracts));
        this.expenditures = await this._api.orders.get().json();

        this.initCharts();
    }

    initCharts() {
        this.drawExpenditureChart();
        this.drawCategoryChart();
    }

    drawExpenditureChart() {    //  multiple line chart
        // initialize and format data

        let chartColors = ['rgb(148,186,104)', 'rgb(102,121,180)', 'rgb(203,101,2)', 'rgb(79,14,0)' ];

        this.expenditures.forEach((expenditure) => {

            let orderDate = moment(expenditure.dateCreated);

//            expenditure.dateCreated = orderDate = orderDate.year( 2015 + Math.round(Math.random()*3)); // for testing purposes

            if (!this.dataYears.includes(orderDate.year()) ) {
                this.dataYears.push(orderDate.year());
            }
        });
        this.dataYears.sort(function(a, b) {
            return a - b;
        });

        let chartData = [];
        let maxChartValue = 0;
        this.dataYears.forEach((dYear) => {
            let dataForYear = {
                year: dYear,
                data: []
            };
            for (let i = 0; i < 12; i++) {
                dataForYear.data.push({
                    date: new Date(2017, i, 1), // fake the year and day for charting purposes
                    value: 0
                });
            }
            this.expenditures.forEach((expenditure) => {
                let orderDate = moment(expenditure.dateCreated);
                let monthNum = orderDate.month();
                if (orderDate.year() === dYear) {
                    dataForYear.data[monthNum].value += expenditure.totalCost;
                }
                maxChartValue = Math.max(maxChartValue, dataForYear.data[monthNum].value);
            });
            chartData.push(dataForYear);

        });
        // initialize and format chart
        let chartMargins = {top: 10, right: 10, bottom: 30, left: 50},
            chartSize = this.getChartSize('.expenditureChartContainer', chartMargins),
            svg = d3.select('.expenditureChartContainer').append('svg');
        svg
            .attr('width', chartSize.baseWidth)
            .attr('height', chartSize.baseHeight);

        // container group for chart elements
        let chartLayer = svg.append('g').classed('chartLayer', true);
        chartLayer
            .attr('width', chartSize.width)
            .attr('height', chartSize.height)
            .attr('transform', 'translate(' + chartMargins.left + ', ' + chartMargins.top + ')');

        // helper functions
        let formatTime = d3.timeFormat('%b');
        let x = d3.scaleTime()
            .rangeRound([0, chartSize.width]);

        let y = d3.scaleLinear()
            .rangeRound([chartSize.height, 0])
            .domain([0, maxChartValue]);

        let valueLine = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });


        // build chart from data


         chartData.forEach((yearData, index) => {
            x.domain(d3.extent(yearData.data, function(d) { return d.date; }));
            if (index === 0) {
                //  x axis, date
                let xAxisGroup = chartLayer.append('g')
                    .attr('transform', 'translate(0,' + chartSize.height + ')')
                    .attr('stroke', '#999999')
                    .attr('stroke-width', .25)
                    .call(d3.axisBottom(x).tickFormat(function(d) { return formatTime(d); }));
                xAxisGroup.selectAll('text')
                    .attr('fill', '#999999')
                    .attr('stroke', 'none');
                xAxisGroup.selectAll('line')
                    .remove();
                xAxisGroup.select('.domain')
                    .remove();

                // y axis, value
               let yAxisGroup = chartLayer.append('g')
                    .attr('stroke-width', .25)
                    .call(d3.axisLeft(y).ticks(3, 'r').tickFormat(function(d) { return '$' + (d/1000) + 'k'; }));
                yAxisGroup.selectAll('text')
                    .attr('fill', '#68afd0')
                    .attr('stroke', '#68afd0');
                yAxisGroup.selectAll('line')
                    .attr('stroke', '#999999');
                yAxisGroup.select('.domain').remove();
                yAxisGroup.selectAll('.tick line')
                    .attr('x2', chartSize.width)
                    .attr('stroke', '#e7e7e7')
                    .attr('stroke-width', 1)
                    .attr('stroke-dasharray', [4, 1]);
            }

             chartLayer.append('path')
                .attr('class', 'line')
                .data([yearData.data])
                .attr('d', valueLine)
                .attr('stroke', chartColors[index])
                .attr('stroke-width', 3)
                .attr('fill', 'none');
         });


    }

    drawCategoryChart() {
        // initialize and format chart
        let chartMargins = {top: 10, right: 10, bottom: 30, left: 50},
            chartSize = this.getChartSize('.categoryChartContainer', chartMargins),
            svg = d3.select('.categoryChartContainer').append('svg');
        svg
            .attr('width', chartSize.baseWidth)
            .attr('height', chartSize.baseHeight);

        // container group for chart elements
        let chartLayer = svg.append('g').classed('chartLayer', true);
        chartLayer
            .attr('width', chartSize.width)
            .attr('height', chartSize.height)
            .attr('transform', 'translate(' + chartMargins.left + ', ' + chartMargins.top + ')');

        let colors = ['rgb(42,106,151)', 'rgb(68,164,208)', 'rgb(167,217,240)'];

        this.expenditures = [
            {   'title': 'Services', 'value': '500000'},
            {   'title': 'Software', 'value': '300000'},
            {   'title': 'Hardware', 'value': '1000000'}
        ];

        let totalExpenditures = 0;
        this.expenditures.forEach((expenditure) => {
            expenditure.value = +expenditure.value;
            totalExpenditures += expenditure.value;
        });
        this.expenditures.sort((a, b) => b.value - a.value);

        console.log('totalExpenditures', totalExpenditures);

        let arcs = d3.pie()
            .sort(null)
            .value(function(d) { return d.value; });

        let arc = d3.arc()
            .outerRadius(chartSize.height/2)
            .innerRadius(chartSize.height/2 - 30)
            .padAngle(0.01);

        let pieG = chartLayer.selectAll('g')
            .data([this.expenditures])
            .enter()
            .append('g')
            .attr('transform', 'translate('+[chartSize.width/4, chartSize.height/2]+')');

        let block = pieG.selectAll('.arc')
            .data(arcs);

        let newBlock = block
            .enter()
            .append('g')
            .classed('arc', true);

        newBlock.append('path')
            .attr('d', arc)
            .attr('id', function(d, i) { return 'arc-' + i; })
            .attr('fill', function(d, i) { return colors[i]; });

        /*newBlock.append('text')
            .attr('dx', 55)
            .attr('dy', -5)
            .append('textPath')
            .attr('xlink:href', function(d, i) { return '#arc-' + i; })
            .text(function(d) { return d.data.title });

        chartLayer.append('g')
            .attr('class', 'chartKeys')
            .data([this.expenditures])
            .enter()
            .append('text')
            .text( function(d) {return d.title}; );*/
    }

    getChartSize(elId, margins) {
        let elSize = d3.select(elId)
            .node()
            .getBoundingClientRect();
        let size = {
            baseWidth: elSize.width,
            baseHeight: elSize.height,
            width: elSize.width - margins.left - margins.right,
            height: elSize.height - margins.top - margins.bottom
        };

        return size;
    }
}
