import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchDTO } from '../DTO/searchDTO';
import d3 = require('d3');
import { StatisticsService } from '../services/statistics-service';
import { geoMercator } from 'd3'


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  searchForm = new FormGroup({
    Condition: new FormControl(''),
    Country: new FormControl(''),
    Sponsor: new FormControl('')
  });

  private trialsByYearData = [];
  private studyTypeData = [];
  private statusData = [];
  private phaseListData = [];
  private locationData = [];
  private sponsorData = [];
  private durationData = [];

  searchDTO: SearchDTO = new SearchDTO();

  private svg;
  private margin = 50;
  private width = 550 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor(private _searchService: StatisticsService) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.svg != undefined) {
      d3.select("figure#trialsByYear").select("svg").remove();
      d3.select("figure#studyType").select("svg").remove();
      d3.select("figure#status").select("svg").remove();
      d3.select("figure#phaseList").select("svg").remove();
      d3.select("figure#location").select("svg").remove();
      d3.select("figure#sponsor").select("svg").remove();
      d3.select("figure#duration").select("svg").remove();
    }

    this.searchDTO = this.searchForm.value;
    this._searchService.searchStatistics(this.searchDTO).subscribe(response => {
      this._searchService.getChart('/trialsByYear').subscribe(data => {
        if (data != null) {
          this.trialsByYearData = data;
          //this.createSvg("trialsByYear");
          this.createLineChart(this.trialsByYearData);
        }
      });
      this._searchService.getChart('/studyType').subscribe(data => {
        if (data != null) {
          //this.studyTypeData = data;
          this.createDoughnutChart(data);
        }
      });
      this._searchService.getChart('/status').subscribe(data => {
        if (data != null) {
          //this.statusData = data;
          this.createReverseBarChart(data);

          this._searchService.getChart('/phaseList').subscribe(data => {
            if (data != null) {
              this.phaseListData = data;
              this.createBarChart("phaseList");
            }
          });
        }
      });
      this._searchService.getChart('/location').subscribe(data => {
        if (data != null) {
          this.createGoogleMap(data);
          //this.createMap(data);
        }
      });
      this._searchService.getChart('/sponsor').subscribe(data => {
        if (data != null) {
          this.sponsorData = data;
        }
      });
      this._searchService.getChart('/duration').subscribe(data => {
        if (data != null) {
          this.durationData = data;
        }
      });
    });
  }

  private createGoogleMap(data:any[]){
    const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 3,
      center: { lat: -28.024, lng: 140.887 },
    }
  );

  // Create an array of alphabetical characters used to label the markers.
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const locations = [
    { lat: -31.56391, lng: 147.154312 },
    { lat: -33.718234, lng: 150.363181 },
    { lat: -33.727111, lng: 150.371124 },
    { lat: -33.848588, lng: 151.209834 },
    { lat: -33.851702, lng: 151.216968 },
    { lat: -34.671264, lng: 150.863657 },
    { lat: -35.304724, lng: 148.662905 },
    { lat: -36.817685, lng: 175.699196 },
    { lat: -36.828611, lng: 175.790222 },
    { lat: -37.75, lng: 145.116667 },
    { lat: -37.759859, lng: 145.128708 },
    { lat: -37.765015, lng: 145.133858 },
    { lat: -37.770104, lng: 145.143299 },
    { lat: -37.7737, lng: 145.145187 },
    { lat: -37.774785, lng: 145.137978 },
    { lat: -37.819616, lng: 144.968119 },
    { lat: -38.330766, lng: 144.695692 },
    { lat: -39.927193, lng: 175.053218 },
    { lat: -41.330162, lng: 174.865694 },
    { lat: -42.734358, lng: 147.439506 },
    { lat: -42.734358, lng: 147.501315 },
    { lat: -42.735258, lng: 147.438 },
    { lat: -43.999792, lng: 170.463352 },
  ];


    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    const markers = locations.map((location, i) => {
      return new google.maps.Marker({
        position: location,
        label: labels[i % labels.length],
      });
    });

    // Add a marker clusterer to manage the markers.
    // @ts-ignore MarkerClusterer defined via script
    new MarkerClusterer(map, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });
  }
  

  private createMap(data: any[]) {


    var projection = d3.geoMercator()
      .scale((this.width - 3) / (2 * Math.PI))
      .translate([this.width / 2, this.height / 2]);

    var path = d3.geoPath()
      .projection(projection);

    var graticule = d3.geoGraticule();

    const svg = d3.select("figure#location")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")")

    svg.append("defs").append("path")
      .datum({ type: "Sphere" })
      .attr("id", "sphere")
      .attr("d", path);

    svg.append("use")
      .attr("class", "stroke")
      .attr("xlink:href", "#sphere");

    svg.append("use")
      .attr("class", "fill")
      .attr("xlink:href", "#sphere");
    svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);
    /*
    d3.json("./maptest.json", function (error, world) {
      if (error) throw error;
      
      svg.insert("path", ".graticule")
        .datum(data.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path)
        .style("fill", "gray");

      svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
          return a !== b;
        }))
        .attr("class", "boundary")
        .attr("d", path)
        .style("fill", "gray");
    });

    svg.selectAll("circle")
      .data(this.cases)
      .enter().append("circle", ".pin")
      .attr("r", 2)
      .attr("transform", function (d) {
        return "translate(" + projection([
          d.longitude,
          d.latitude
        ]) + ")";
      })
      .style("fill", "steelblue");*/
  }

  maxWidth: number;

  private createReverseBarChart(data: any[]) {
    const svg = d3.select("figure#status")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

    // Create the Y-axis band scale
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return d.NUM + 10; })])
      .range([0, this.width]);

    //Define the chart colors
    let colors = d3.scaleOrdinal()
      .domain(data.map(d => d.OverallStatus))
      .range(["#34a892", "#20b196", "#1ec8a9", "#20d5b4", "#17deb9"]);


    // Define max label for translating the chart
    var maxLabel = d3.max(data, function (d) { return d.OverallStatus; }), maxWidth;

    svg.append("text").text(maxLabel)
      .each(function () { maxWidth = this.getBBox().width; })
      .remove();

    this.maxWidth = maxWidth;

    // Draw the X-axis on the DOM
    svg.append("g")
      //.attr("transform", "translate(0," + this.height + ")")
      .attr("transform", "translate(" + Math.max(this.margin, maxWidth) + "," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-20)")
      .style("text-anchor", "end");

    const y = d3.scaleBand()
      .range([0, this.height])
      .domain(data.map(d => d.OverallStatus));

    //svg.attr("transform", "translate(" + Math.max(this.margin, maxWidth) + "," + this.margin + ")");

    // Draw the Y-axis on the DOM
    svg.append("g")
      .attr("transform", "translate(" + Math.max(this.margin, maxWidth) + ")")
      .call(d3.axisLeft(y))
      .selectAll("text")
      //.attr("transform", "translate(-10,0))")
      .style("text-anchor", "end");

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    var bars = svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("g")

    let barsMargin = Math.max(this.margin, maxWidth) + 1;
    //append rects
    bars.append("rect")
      .attr("class", "bar")
      .attr("transform", "translate(" + barsMargin + ", 0)")
      .attr("y", function (d) {
        return y(d.OverallStatus);
      })
      .attr("height", y.bandwidth())
      .attr("x", d => x(d.NUM))
      .attr("fill", (d, i) => colors(i))
      .attr("width", function (d) {
        return 0;
      })
      .on("mouseover", function (d) {
        d3.select(this)
          .style("cursor", "pointer");
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("Number of trials: " + d.target.__data__.NUM + "<br/>" + "Status: " + d.target.__data__.OverallStatus)
          .style("left", (d.screenX) + "px")
          .style("top", (d.screenY - 28) + "px")
          .style("position", "absolete")
          .style("background", "lightsteelblue")
          .style("padding", "2px")
          .style("border-radius", "8px")
          .style("font", " 12px")
          .style("text-align", "center");
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .style("cursor", "default");
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Animation
    svg.selectAll("rect")
      .transition()
      .duration(800)
      .attr("x", 0)
      .attr("width", (d) => x(d.NUM))
      .delay(function (d, i) { return (i * 100) })
  }


  private createBarChart(type: string): void {
    var newMargin = this.margin + this.maxWidth + 70;

    this.svg = d3.select("figure#" + type)
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + newMargin + "," + this.margin + ")");

    switch (type) {
      case "phaseList":
        this.drawBars(this.phaseListData);
        break;
    }

  }

  private drawBars(data: any[]): void {
    data.forEach(element => {
      element.Phase = element.Phase.replace('[\"', '');
      element.Phase = element.Phase.replace('\"]', '');
      element.Phase = element.Phase.replace('\",\"', ', ');
    });

    var newMargin = this.margin + this.maxWidth;

    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width - newMargin])
      .domain(data.map(d => d.Phase))
      .padding(0.4);

    let colors = d3.scaleOrdinal()
      .domain(data.map(d => d.NUM.toString()))
      .range(["#34a892", "#20b196", "#1ec8a9", "#20d5b4", "#17deb9"]);


    // Draw the X-axis on the DOM
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-20)")
      .style("text-anchor", "end");
    // Scalable Y-axis
    var max = Math.max.apply(Math, data.map(function (o) { return o.NUM; }))
    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return d.NUM + 10; })])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.Phase))
      .attr("y", d => y(d.NUM))
      .attr("width", x.bandwidth())
      .attr("height", (d) => this.height - y(0))
      .attr('fill', (d, i) => (colors(i)))
      .on("mouseover", function (d) {
        d3.select(this)
          .style("cursor", "pointer");
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("Number of trials: " + d.target.__data__.NUM + "<br/>" + "Phase: " + d.target.__data__.Phase)
          .style("left", (d.screenX) + "px")
          .style("top", (d.screenY - 28) + "px")
          .style("position", "absolete")
          .style("background", "lightsteelblue")
          .style("padding", "2px")
          .style("border-radius", "8px")
          .style("font", " 12px")
          .style("text-align", "center");
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .style("cursor", "default");
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Animation
    this.svg.selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", d => y(d.NUM))
      .attr("height", (d) => this.height - y(d.NUM))
      .delay(function (d, i) { console.log(i); return (i * 100) })

  }

  private createDoughnutChart(data: any[]) {
    const svg = d3.select("figure#studyType").append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin * 6 + "," + this.margin * 4 + ")");

    var radius = Math.min(this.width + (this.margin * 2), this.height + (this.margin * 2)) / 2 - this.margin

    // set the color scale
    var color = d3.scaleOrdinal()
      .domain(data.map(d => d.StudyType))
      .range(["#04BF9D", "#3E372A", "#2CB199", "#7D735F"]);
    //.range(d3.schemeDark2);

    var numData = data.map(d => d.NUM);
    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(function (d) { return d.NUM; })
    var data_ready = pie(data)

    // The arc generator
    var arc = d3.arc()
      .innerRadius(radius * 0.5)         // This is the size of the donut hole
      .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d) { return (color(d.data.StudyType)) })//bilo key
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    // Add the polylines between chart and labels:
    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
      .attr("stroke", "#3E372A")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', function (d) {
        var posA = arc.centroid(d) // line insertion in the slice
        var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.5 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC]
      });


    var total = data.reduce((a, b) => +a + +b.NUM, 0);

    // Add the text:
    svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
      .text(function (d) { return d.data.StudyType + " " + (100 * (d.data.NUM / total)).toFixed(2) + "%" })
      .style("fill", "#25A18A")
      .attr('transform', function (d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.6 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
      })/*
    .attr("transform", function (d) {
      var pos = outerArc.centroid(d);
      pos[1] = pos[1] - 10;
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.50 * (midangle < Math.PI ? 1 : -1);
      return "translate(" + pos + ") ";
    })*/
      .attr("dy", 5)
      .style('text-anchor', function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
      })


  }

  private createLineChart(data: any[]) {
    const svg = d3.select("figure#trialsByYear").append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

    //sorted array
    var sortedYears: any[] = data.sort((n1, n2) => n1.year - n2.year);

    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(sortedYears.map(d => d.year))
      .padding(0.4);

    svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-20)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return d.NUM + 10; })])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    svg.append("g")
      .call(d3.axisLeft(y));


    var line = d3.line()
      .curve(d3.curveCatmullRom)
      .x(d => x(d.year))
      .y(d => y(d.NUM))

    // Define the length of line
    const l = (line(sortedYears)).length;

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg.append("path")
      .datum(sortedYears)
      .attr("fill", "none")
      .attr("stroke", "#2cb199")
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", `0,${l}`)
      .attr("d", line)
      .transition()
      .duration(5000)
      .ease(d3.easeLinear)
      .attr("stroke-dasharray", `${l},${l}`);

    svg.append("g")
      .attr("fill", "#2cb199")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .selectAll("circle")
      .data(sortedYears)
      .join("circle")
      .attr("cx", d => x(d.year))
      .attr("cy", d => y(d.NUM))
      .attr("r", 5.5)
      .on("mouseover", function (d) {
        d3.select(this)
          .style("cursor", "pointer")
          .attr("fill", "white")
          .attr("stroke", "#2cb199");
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("Number of trials: " + d.target.__data__.NUM + "<br/>" + "Year: " + d.target.__data__.year)
          .style("left", (d.screenX) + "px")
          .style("top", (d.screenY - 28) + "px")
          .style("position", "absolete")
          .style("background", "lightsteelblue")
          .style("padding", "2px")
          .style("border-radius", "8px")
          .style("font", " 12px")
          .style("text-align", "center");
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .style("cursor", "default")
          .attr("fill", "#2cb199")
          .attr("stroke", "white");
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    const label = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("g")
      .data(sortedYears)
      .join("g")
      .attr("transform", d => `translate(${x(d.year)},${y(d.NUM)})`)
      .attr("opacity", 0)
      .on("mouseover", function (d) {
        d3.select(this)
          .style("cursor", "pointer");
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("Number of trials: " + d.target.__data__.NUM + "<br/>" + "Year: " + d.target.__data__.year)
          .style("left", (d.screenX) + "px")
          .style("top", (d.screenY - 28) + "px")
          .style("position", "absolete")
          .style("background", "lightsteelblue")
          .style("padding", "2px")
          .style("border-radius", "8px")
          .style("font", " 12px")
          .style("text-align", "center");
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .style("cursor", "default");

        div.transition()
          .duration(500)
          .style("opacity", 0);
      });;

    label.append("text")
      .text(d => d.NUM)
      .call(this.halo);

    label.transition()
      .delay((d, i) => (line(data.slice(0, i + 1))).length / l * (5000 - 125))
      .attr("opacity", 1);

  }

  private halo(text) {
    text.select(function () { return this.parentNode.insertBefore(this.cloneNode(true), this); })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
  }

}
