import {Component, Input} from '@angular/core';
import template from './Dashboard.html';
import styles from './Dashboard.scss';
import Api from '../../../../raml/api.v1.raml';
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

    async ngOnInit() {
        this.contracts = await this._api.contracts.get().json();
        //console.log('contracts', this.contracts);
        this.expenditures = await this._api.expenditures.get().json();
        //console.log('expenditures', JSON.stringify(this.expenditures));

        this.initCharts();
    }

    initCharts() {
        this.drawExpenditureChart();
        this.drawCategoryChart();
    }

    drawExpenditureChart() {    //  multiple line chart
        // initialize and format data

        let chartColors = ['rgb(148,186,104)', 'rgb(102,121,180)', 'rgb(203,101,2)', 'rgb(79,14,0)' ];
        let dataYears = [];
        this.expenditures.forEach((expenditure) => {
            // expenditure.year = 2015 + Math.round(Math.random()*2); // for testing purposes
            //  derive years
            if (!dataYears.includes(expenditure.year) ) {
                dataYears.push(expenditure.year);
            }
        });

        let chartData = [];
        let maxChartValue = 0;
        dataYears.forEach((dYear) => {
            let dataForYear = {
                year: dYear,
                data: []
            };
            for (let i = 0; i < 12; i++) {
                dataForYear.data.push({
                    date: new Date(2017, i, 1), // fake the date for charting
                    value: 0
                });
            }
            this.expenditures.forEach((expenditure) => {
                let monthNum = parseInt(expenditure.effectiveDate.split('-')[1], 10);
                if (expenditure.year === dYear) {
                    dataForYear.data[monthNum - 1].value += expenditure.expenditure;
                }
                maxChartValue = Math.max(maxChartValue, dataForYear.data[monthNum - 1].value);
            });
            chartData.push(dataForYear);

        });
        // initialize and format chart
        let chartMargins = {top: 10, right: 10, bottom: 30, left: 50},
            chartSize = this.getChartSize('.expenditureChart', chartMargins),
            svg = d3.select('.expenditureChart').append('svg');
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
        // let parseTime = d3.timeParse('%b');
        let formatTime = d3.timeFormat('%m');
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
            x.domain(d3.extent(yearData.data, function(d) { return d.date }));
            if(index === 0) {
                //  x axis, date
                let xAxisGroup = chartLayer.append('g')
                    .attr('transform', 'translate(0,' + chartSize.height + ')')
                    .attr('stroke', '#999999')
                    .attr('stroke-width', .25)
                    .call(d3.axisBottom(x).tickFormat(function(d) { return formatTime(d) }));
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
