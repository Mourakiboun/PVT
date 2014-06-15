		var map = L.map('map').setView([33.7, 11.6], 6);

		 L.tileLayer('http://{s}.tiles.mapbox.com/v3/tunisia.map-u3z7fdnm/{z}/{x}/{y}.png',  { attributionControl: false,
    //attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(map);


		// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>MOURAKIBOUN RESPONSE RATE</h4>' +  (props ?
				'District : <b>' + props.NAME + '</b><br />' 
				+'Coordinator Name : <b>'+ props.c_name + '</b><br />'
				+'Coordinator Phone : <b>'+ props.c_phone + '</b><br /><br />'
				+'Received vs Needed : <b>'+ props.received + '/' + props.needed + '</b><br />'
				+'Response Rate : <b>'+ props.percent + '%</b><br />'
				: 'Hover over a district');
		};

		info.addTo(map);


		// get color depending on population density value
		function getColor(d) {
			return d > 99 ? '#54c200' :
			       d > 95  ? '#9c0' :
			       //d > 95  ? '#b4ff05' :
			       d > 89  ? '#ebff6b' :
			       d > 80  ? '#ffce6b' :
			       
			       d > 0  ? '#c00' :
			       d = 0   ? '#c00' :
			                 '#c00';
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.percent)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var geojson;
		
		

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}


		geojson = L.geoJson(circooo, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

		
		
		map.attributionControl.addAttribution('Election data &copy; <a href="http://mourakiboun.org/">Mourakiboun</a>');

		
		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 80, 90, 95, 99],
				labels = [],
				from, to;


				

			for (var i = 0; i < grades.length-1; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from+1) + '"></i> ' +
					from + '&ndash;' + to+'&#37;' );
			}
			labels.push(
					'<i style="background:' + getColor(100) + '"></i> 100%'); 

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);
		



