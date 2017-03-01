import {Component, Input} from '@angular/core';
import template from './Budget.html';
import styles from './Budget.scss';
import moment from 'moment';
import Api from '../../../../raml/api.v1.raml';
import i18next from 'i18next';
import * as d3 from 'd3';
//import $ from 'jQuery';

@Component({
    selector: 'budget',
    template: template,
    styles: [styles]
})
/**
 * @see https://angular.io/docs/ts/latest/api/core/Component-decorator.html
 * @example
 * <budget name='Budget' (change)='onChange($event)'></budget>
 */
export default class Budget {
    /**
     * An example input for this component
     * @see https://angular.io/docs/ts/latest/api/core/Input-var.html
     */
    @Input() name:string = 'Budget';

    _api:Api;

    constructor() {
        this._api = new Api();
        i18next.on('languageChanged', () => { this.loadMonthNames(); });
    }

    myOrders:Array = [];
    amountPerMonth:Array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    aggregatedByMonth:Array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    monthNames:Array = ['', '', '', '', '', '', '', '', '', '', '', ''];

    async ngOnInit() {
        this.amountPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.aggregatedByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.myOrders = await this._api.orders.get().json();
        this.myOrders.forEach( (order) => {
            let month = moment(order.dateCreated).month();
            this.amountPerMonth[month] += order.totalCost;
            for (let i = 11; i >= month; i--) {
                this.aggregatedByMonth[i] += order.totalCost;
            }
        });
        this.loadMonthNames();
        this.initCharts();
    }

    loadMonthNames() {
        for (let i = 0; i < 12; i++) {
            this.monthNames[i] = i18next.t('month' + i);
        }
    }

    initCharts() {
        this.drawBudgetChart();
        this.drawPurchasesChart();
    }

    drawBudgetChart() { // area chart
        let chartData = [];
        for (let i = 0; i < this.aggregatedByMonth.length; i++) {
            chartData[i] = {
                date: this.monthNames[i].substr(0, 3), // correct for 'sept' throwing things off.
                value: this.aggregatedByMonth[i]
            };
        }
        let chartMargins = {top: 40, right: 10, bottom: 40, left: 50},
            chartSize = this.getChartSize('.chart-budget', chartMargins),
            svg = d3.select('.chart-budget').append('svg');
        svg
            .attr('width', chartSize.baseWidth)
            .attr('height', chartSize.baseHeight);

        // container group for chart elements
        let chartLayer = svg.append('g').classed('chartLayer', true);
        chartLayer
            .attr('width', chartSize.width)
            .attr('height', chartSize.height)
            .attr('transform', 'translate(' + chartMargins.left + ', ' + chartMargins.top + ')')
            .append('text')
            .text('Budget')
            .attr('x', '-10')
            .attr('y', '-10')
            .attr('stroke-width', 2);

        // helper functions
        let parseTime = d3.timeParse('%b');
        let x = d3.scaleTime().rangeRound([0, chartSize.width]);
        let y = d3.scaleLinear().rangeRound([chartSize.height, 0]);

        let area = d3.area()
            .x(function(d) { return x(d.date); })
            .y0(chartSize.height)
            .y1(function(d) { return y(d.value); });

        /*let valueLine = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });*/

        chartData.forEach(function(d) {
            d.date = parseTime(d.date);
        });

        x.domain(d3.extent(chartData, function(d) { return d.date; }));
        y.domain(d3.extent(chartData, function(d) { return d.value; }));

        //  x axis
        let xAxisGroup = chartLayer.append('g')
            .attr('transform', 'translate(0,' + chartSize.height + ')')
            .attr('stroke', '#999999')
            .attr('stroke-width', .25)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b')));
        xAxisGroup.selectAll('text')
            .attr('fill', '#999999')
            .attr('stroke', 'none');
        xAxisGroup.selectAll('line')
            .attr('stroke', 'none');

        // y axis
       let yAxisGroup = chartLayer.append('g')
            .attr('stroke', '#999999')
            .attr('stroke-width', .25)
            .call(d3.axisLeft(y).ticks(4, 'r'));
        yAxisGroup.selectAll('text')
            .attr('fill', '#999999')
            .attr('stroke', 'none');
        yAxisGroup.selectAll('line')
            .attr('stroke', '#999999');
        yAxisGroup.select('.domain').remove();
        yAxisGroup.selectAll('.tick line').remove();

        //  fill area
        chartLayer.append('path')
            .data([chartData])
            .attr('class', 'budgetArea')
            .attr('fill', 'rgba(45,115,188,.25)')
            .attr('d', area);
    }


    drawPurchasesChart() { // vertical bar
        let chartData = [];
        for (let i = 0; i < this.aggregatedByMonth.length; i++) {
            chartData[i] = {
                date: this.monthNames[i],
                value: this.amountPerMonth[i]
            };
        }

        let chartMargins = {top: 40, right: 10, bottom: 40, left: 50},
            chartSize = this.getChartSize('.chart-purchases', chartMargins),
            svg = d3.select('.chart-purchases').append('svg');
        svg
            .attr('width', chartSize.baseWidth)
            .attr('height', chartSize.baseHeight);

        let chartLayer = svg.append('g').classed('chartLayer', true);
        chartLayer
            .attr('width', chartSize.width)
            .attr('height', chartSize.height)
            .attr('transform', 'translate(' + chartMargins.left + ', ' + chartMargins.top + ')')
            .append('text')
            .text('Purchases')
            .attr('x', '-10')
            .attr('y', '-10');

        let x = d3.scaleBand().rangeRound([0, chartSize.width]).padding(0.5),
            y = d3.scaleLinear().rangeRound([chartSize.height, 0]);


        x.domain(chartData.map(function(d) { return d.date; }));
        y.domain([0, d3.max(chartData, function(d) { return d.value; })]);


        let xAxisGroup = chartLayer.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + chartSize.height + ')')
            .attr('stroke', '#999999')
            .attr('stroke-width', .25)
            .call(d3.axisBottom(x));
        xAxisGroup.selectAll('text')
            .attr('fill', '#999999')
            .attr('stroke', 'none');
        xAxisGroup.selectAll('line')
            .attr('stroke', '#999999');

        let yAxisGroup = chartLayer.append('g')
            .attr('class', 'axis axis--y')
            .attr('stroke', '#999999')
            .attr('stroke-width', .25)
            .call(d3.axisLeft(y).ticks(3, 'r'));
        yAxisGroup.selectAll('text')
            .attr('fill', '#999999')
            .attr('stroke', 'none');
        yAxisGroup.selectAll('line')
            .attr('stroke', '#999999');
        yAxisGroup.select('.domain').remove();
        yAxisGroup.selectAll('.tick line').remove();

        chartLayer.selectAll('.bar')
            .data(chartData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) { return x(d.date); })
            .attr('y', function(d) { return y(d.value); })
            .attr('width', x.bandwidth())
            .attr('height', function(d) { return chartSize.height - y(d.value); })
            .attr('fill', '#0074be');


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
