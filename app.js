"use strict";

const { useEffect, useState } = React;

const createGoogleMapsLink = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

// KORREKTUR: Hier sind jetzt ALLE Reisedaten von Tag 1 bis 12 enthalten.
const REISEPLAN_DATEN = [{
  tag: 1,
  titel: "Ankunft & Edinburgh",
  startOrt: "Spaceships Rentals",
  zielOrt: "Mortonhall Park",
  startCoords: { lat: 55.923, lon: -3.358 },
  zielCoords: { lat: 55.908, lon: -3.193 },
  distanz: "15 km",
  fahrzeit: "30min",
  infos: [{ icon: "Burg", title: "Edinburgh Castle", gmaps: "Edinburgh Castle", web: "https://www.edinburghcastle.scot/", desc: "Das Wahrzeichen der Stadt. Tickets unbedingt 2-3 Wochen vorbuchen!" }, { icon: "Aussicht", title: "Calton Hill", gmaps: "Calton Hill, Edinburgh", web: "https://www.visitscotland.com/info/see-do/calton-hill-p255151", desc: "Leichter Aufstieg für den besten Panoramablick. Perfekt für den Sonnenuntergang." }, { icon: "Essen", title: "Kulinarik-Tipp", desc: "Probiert Haggis, Neeps and Tatties in einem Pub am Grassmarket oder in der Rose Street." }, { icon: "Tipp", title: "Praktischer Hinweis", desc: "Lasst den Camper stehen! Nutzt den Bus ins Zentrum. Kauft ein Tagesticket ('DAYticket')." }]
}, {
  tag: 2,
  titel: "Kelpies & Tor nach Loch Lomond",
  startOrt: "Edinburgh",
  zielOrt: "Luss, Loch Lomond",
  startCoords: { lat: 55.908, lon: -3.193 },
  zielCoords: { lat: 56.101, lon: -4.633 },
  distanz: "100 km",
  fahrzeit: "1h 45min",
  infos: [{ icon: "Tiere", title: "The Kelpies", gmaps: "The Kelpies, Falkirk", web: "https://www.thehelix.co.uk/", desc: "Gigantische Pferdeköpfe. Plant mind. 1-2 Stunden für einen Spaziergang im Helix Park ein." }, { icon: "Burg", title: "Stirling Castle (Optional)", gmaps: "Stirling Castle", web: "https://www.stirlingcastle.scot/", desc: "Eine großartige Alternative zu Edinburgh Castle, oft als noch beeindruckender empfunden." }, { icon: "Dorf", title: "Luss Village", gmaps: "Luss, Scotland", web: "https://www.lochlomond-trossachs.org/things-to-do/visiting-the-national-park/luss/", desc: "Besucht das malerische Dorf mit seinen hübschen Cottages direkt am Seeufer." }]
}, {
  tag: 3,
  titel: "Durch Glen Coe",
  startOrt: "Luss",
  zielOrt: "Glencoe Village",
  startCoords: { lat: 56.101, lon: -4.633 },
  zielCoords: { lat: 56.666, lon: -5.103 },
  distanz: "100 km",
  fahrzeit: "2h",
  infos: [{ icon: "Foto", title: "Three Sisters Viewpoint", gmaps: "Three Sisters Viewpoint, Glencoe", web: "https://www.walkhighlands.co.uk/fortwilliam/glencoe.shtml", desc: "Der berühmteste Fotostopp. Seid früh da oder habt Geduld, es kann voll werden." }, { icon: "Film", title: "Skyfall-Location (Glen Etive)", gmaps: "Dalness, Glen Etive", web: "https://www.visitscotland.com/info/towns-villages/glen-etive-p1208931", desc: "Ein Abstecher auf der einspurigen Straße Glen Etive führt euch zur berühmten Filmkulisse." }, { icon: "Pub", title: "Clachaig Inn", gmaps: "Clachaig Inn, Glencoe", web: "https://clachaig.com/", desc: "Eine Institution in Glen Coe. Perfekt für ein herzhaftes Mittagessen oder ein lokales Ale." }]
}, {
  tag: 4,
  titel: "Glenfinnan & Fort William",
  startOrt: "Glen Coe",
  zielOrt: "Fort William",
  startCoords: { lat: 56.666, lon: -5.103 },
  zielCoords: { lat: 56.819, lon: -5.107 },
  distanz: "55 km",
  fahrzeit: "1h",
  infos: [{ icon: "Zug", title: "Glenfinnan Viaduct", gmaps: "Glenfinnan Viaduct View Point", web: "https://www.nts.org.uk/visit/places/glenfinnan-monument", desc: "Prüft online die genauen Zeiten, wann der Jacobite-Zug das Viadukt überquert! Ein Muss." }, { icon: "Berg", title: "Ben Nevis (Blick)", gmaps: "Ben Nevis Visitor Centre", web: "https://www.walkhighlands.co.uk/fortwilliam/bennevis.shtml", desc: "Das Visitor Centre ist der Startpunkt für Wanderungen zum höchsten Berg Großbritanniens." }, { icon: "Shop", title: "Vorbereitung", desc: "Fort William ist der letzte große Supermarkt vor Skye. Füllt eure Vorräte für die nächsten Tage auf." }]
}, {
  tag: 5,
  titel: "Fähre & Isle of Skye (Süden)",
  startOrt: "Fort William",
  zielOrt: "Sligachan, Skye",
  startCoords: { lat: 56.819, lon: -5.107 },
  zielCoords: { lat: 57.291, lon: -6.177 },
  distanz: "100 km",
  fahrzeit: "2h + Fähre",
  infos: [{ icon: "Fähre", title: "Fähre nach Skye (CalMac)", gmaps: "Mallaig Ferry Terminal", web: "https://www.calmac.co.uk/mallaig-armadale-skye-ferry-summer-timetable", desc: "Fahrt die 'Road to the Isles' nach Mallaig und nehmt die Fähre. MUSS vorgebucht werden!" }, { icon: "Natur", title: "Fairy Pools", gmaps: "Fairy Pools Car Park, Glenbrittle", web: "https://www.isleofskye.com/things-to-do/fairy-pools", desc: "Magische Wasserfälle. Benötigt gutes Schuhwerk. Kann bei viel Regen sehr matschig sein." }, { icon: "Whisky", title: "Talisker Distillery", gmaps: "Talisker Distillery, Carbost", web: "https://www.malts.com/en-row/distilleries/talisker", desc: "Besuch der berühmten Destillerie in Carbost. Touren müssen fast immer online vorgebucht werden." }]
}, {
  tag: 6,
  titel: "Isle of Skye (Norden)",
  startOrt: "Sligachan",
  zielOrt: "Staffin, Skye",
  startCoords: { lat: 57.291, lon: -6.177 },
  zielCoords: { lat: 57.625, lon: -6.206 },
  distanz: "60 km",
  fahrzeit: "1h 15min",
  infos: [{ icon: "Wandern", title: "Old Man of Storr", gmaps: "Old Man of Storr Car Park", web: "https://www.isleofskye.com/things-to-do/the-old-man-of-storr", desc: "Die lohnende Wanderung zur Felsnadel. Geht früh los, um den Massen zu entgehen." }, { icon: "Auto", title: "Quiraing Loop", gmaps: "Quiraing Car Park", web: "https://www.theskyeguide.com/walking-main/trotternish-ridge/quiraing", desc: "Eine der spektakulärsten Passstraßen. Der Parkplatz oben ist oft voll." }, { icon: "Dorf", title: "Hafen von Portree", gmaps: "Portree Harbour", web: "https://www.isleofskye.com/portree", desc: "Die Hauptstadt von Skye. Hier könnt ihr tanken, einkaufen und die berühmten bunten Häuser fotografieren." }]
}, {
  tag: 7,
  titel: "Start der North Coast 500",
  startOrt: "Staffin",
  zielOrt: "Ullapool",
  startCoords: { lat: 57.625, lon: -6.206 },
  zielCoords: { lat: 57.897, lon: -5.159 },
  distanz: "200 km",
  fahrzeit: "3h 30min",
  infos: [{ icon: "Burg", title: "Eilean Donan Castle", gmaps: "Eilean Donan Castle", web: "https://www.eileandonancastle.com/", desc: "Ein kurzer Abstecher von der Skye Bridge. Die meistfotografierte Burg Schottlands." }, { icon: "Landschaft", title: "Wester Ross Coastal Trail", web: "https://www.northcoast500.com/blog/your-guide-to-wester-ross/", desc: "Dies ist der schönste Teil der NC500. Die Strecke über Gairloch nach Ullapool ist phänomenal." }, { icon: "Essen", title: "The Seafood Shack", gmaps: "The Seafood Shack, Ullapool", web: "https://www.seafoodshack.co.uk/", desc: "In Ullapool angekommen, gönnt euch superfrischen Fisch und Meeresfrüchte." }]
}, {
  tag: 8,
  titel: "Höhepunkte der Nordküste",
  startOrt: "Ullapool",
  zielOrt: "Inverness",
  startCoords: { lat: 57.897, lon: -5.159 },
  zielCoords: { lat: 57.477, lon: -4.224 },
  distanz: "95 km",
  fahrzeit: "1h 30min",
  infos: [{ icon: "Strand", title: "Achmelvich Bay", gmaps: "Achmelvich Bay", web: "https://www.northcoast500.com/listing/achmelvich-beach/", desc: "Ein Abstecher zu einem der schönsten Strände Schottlands mit weißem Sand und türkisfarbenem Wasser." }, { icon: "Brücke", title: "Kylesku Bridge", gmaps: "Kylesku Bridge Viewpoint", web: "https://www.thestorybehindthestructure.co.uk/kylesku-bridge/", desc: "Eine elegant geschwungene, ikonische Brücke und ein fantastisches Fotomotiv." }, { icon: "Natur", title: "Loch Ness & Urquhart Castle", gmaps: "Urquhart Castle", web: "https://www.historicenvironment.scot/visit-a-place/places/urquhart-castle/", desc: "Haltet Ausschau nach Nessie! Urquhart Castle bietet die beste Aussicht auf den See." }]
}, {
  tag: 9,
  titel: "Speyside Whisky & Moray Firth",
  startOrt: "Inverness",
  zielOrt: "Portknockie",
  startCoords: { lat: 57.477, lon: -4.224 },
  zielCoords: { lat: 57.706, lon: -2.855 },
  distanz: "110 km",
  fahrzeit: "2h",
  infos: [{ icon: "Geschichte", title: "Culloden Battlefield", gmaps: "Culloden Battlefield", web: "https://www.nts.org.uk/visit/places/culloden", desc: "Ein sehr bewegender und wichtiger Ort der schottischen Geschichte, direkt bei Inverness." }, { icon: "Whisky", title: "Speyside Cooperage", gmaps: "Speyside Cooperage Visitor Centre", web: "https://www.speysidecooperage.co.uk/", desc: "Erlebt, wie Whiskyfässer von Hand gefertigt werden. Eine faszinierende Tour." }, { icon: "Foto", title: "Bow Fiddle Rock", gmaps: "Bow Fiddle Rock, Portknockie", web: "https://www.visitscotland.com/info/see-do/bow-fiddle-rock-p2562111", desc: "Euer Zielort ist berühmt für diesen außergewöhnlichen Felsbogen im Meer." }]
}, {
  tag: 10,
  titel: "Dunnottar Castle & Ostküste",
  startOrt: "Portknockie",
  zielOrt: "Stonehaven",
  startCoords: { lat: 57.706, lon: -2.855 },
  zielCoords: { lat: 56.962, lon: -2.210 },
  distanz: "90 km",
  fahrzeit: "1h 45min",
  infos: [{ icon: "Burg", title: "Dunnottar Castle", gmaps: "Dunnottar Castle Car Park", web: "https://www.dunnottarcastle.co.uk/", desc: "Das Highlight des Tages. Eine dramatisch auf einer Klippe gelegene Burgruine." }, { icon: "Tiere", title: "RSPB Fowlsheugh", gmaps: "RSPB Fowlsheugh car park", web: "https://www.rspb.org.uk/reserves-and-events/reserves-a-z/fowlsheugh/", desc: "Nahe Dunnottar befindet sich eine riesige Klippe voller Seevögel (inkl. Papageientaucher im Sommer)." }, { icon: "Essen", title: "Kulinarik-Tipp", gmaps: "The Carron Fish Bar, Stonehaven", web: "https://www.facebook.com/carronfishbar/", desc: "Stonehaven gilt als Geburtsort des 'Deep-fried Mars Bar'. Wenn nicht hier, wo dann?" }]
}, {
  tag: 11,
  titel: "St. Andrews & Fischerdörfer",
  startOrt: "Stonehaven",
  zielOrt: "St. Andrews",
  startCoords: { lat: 56.962, lon: -2.210 },
  zielCoords: { lat: 56.339, lon: -2.796 },
  distanz: "95 km",
  fahrzeit: "1h 30min",
  infos: [{ icon: "Sport", title: "St. Andrews", gmaps: "St Andrews Cathedral", web: "https://www.standrews.com/", desc: "Die Heimat des Golfs. Besucht den Old Course, die Ruinen der Kathedrale und die Universität." }, { icon: "Dorf", title: "Fife Fishing Villages", web: "https://www.visitscotland.com/info/tours/fife-coastal-route-p247501", desc: "Fahrt die Küstenstraße ('East Neuk') und haltet in Crail, Anstruther und Pittenweem." }, { icon: "Essen", title: "Bestes Fish & Chips", gmaps: "Anstruther Fish Bar", web: "https://www.anstrutherfishbar.co.uk/", desc: "Gewinnt regelmäßig Preise für das beste Fish & Chips in Großbritannien. Rechnet mit einer Warteschlange." }]
}, {
  tag: 12,
  titel: "Forth Bridges & Abschied",
  startOrt: "St. Andrews",
  zielOrt: "Spaceships Rentals",
  startCoords: { lat: 56.339, lon: -2.796 },
  zielCoords: { lat: 55.923, lon: -3.358 },
  distanz: "75 km",
  fahrzeit: "1h 15min",
  infos: [{ icon: "Brücke", title: "Forth Bridges Viewpoint", gmaps: "Forth Bridges Viewpoint, South Queensferry", web: "https://www.theforthbridges.org/", desc: "Macht einen letzten Stopp, um die drei imposanten Brücken aus drei Jahrhunderten zu bestaunen." }, { icon: "Pause", title: "Letzter Kaffee", gmaps: "Hawes Inn, South Queensferry", web: "https://www.vintageinn.co.uk/restaurants/scotland-northernireland/thehawesinnsouthqueensferry", desc: "Das historische Hawes Inn ist perfekt, um die Reise ausklingen zu lassen." }, { icon: "Camper", title: "Camper-Rückgabe", desc: "Plant genug Zeit ein! Ihr müsst tanken, Wasser ablassen, putzen und auf die Abnahme warten." }]
}];

// KORREKTUR: Vereinfachte Marker-Logik für bessere Stabilität.
// Die vorherige Methode mit Nummern im Marker-Namen war nicht standardkonform und hat die Karte zum Absturz gebracht.
const GesamtroutenKarte = () => {
  const markers = REISEPLAN_DATEN.map(tag => `marker=${tag.zielCoords.lat},${tag.zielCoords.lon}`).join('&');
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=-8.6,54.6,-0.7,59&layer=mapnik&${markers}`;
  return React.createElement("div", { className: "map-container" },
    React.createElement("iframe", {
      width: "100%", height: "100%",
      src: mapSrc,
      style: { border: 0 },
      loading: "lazy",
      referrerPolicy: "no-referrer-when-downgrade"
    })
  );
};

const Tageskarte = ({ tagData, isActive, onHeaderClick }) => {
  const mapSrc = `https://www.openstreetmap.org/directions/embed?from=${tagData.startCoords.lat}%2C${tagData.startCoords.lon}&to=${tagData.zielCoords.lat}%2C${tagData.zielCoords.lon}&route=car`;
  return React.createElement("div", { className: "day-card" },
    React.createElement("div", { className: `day-header ${isActive ? 'active' : ''}`, onClick: onHeaderClick },
      React.createElement("span", { className: `accordion-arrow ${isActive ? 'open' : ''}` }, "\u25B6"),
      React.createElement("h2", null, "Tag ", tagData.tag, ": ", tagData.titel),
      React.createElement("div", { className: "route-info-header" }, React.createElement("span", null, tagData.distanz, " / ca. ", tagData.fahrzeit))
    ),
    React.createElement("div", { className: `day-card-body ${isActive ? 'open' : ''}` },
      React.createElement("div", { className: "day-card-content" },
        React.createElement("div", null,
          React.createElement("h3", null, "Tagesplan & Empfehlungen"),
          tagData.infos.map(item => React.createElement("div", { key: item.title, className: "info-block" },
            React.createElement("div", { className: "info-block-icon" }, item.icon, ":"),
            React.createElement("div", null,
              React.createElement("div", { className: "info-block-title" },
                React.createElement("span", null, item.title),
                React.createElement("span", { className: "link-icons" },
                  item.gmaps && React.createElement("a", { href: createGoogleMapsLink(item.gmaps), target: "_blank", rel: "noopener noreferrer", title: `Navigation zu ${item.title} starten` }, "(Karte)"),
                  item.web && React.createElement("a", { href: item.web, target: "_blank", rel: "noopener noreferrer", title: `Website für ${item.title} öffnen` }, "(Web)")
                )
              ),
              React.createElement("div", { className: "info-block-desc" }, item.desc)
            )
          ))
        ),
        React.createElement("div", null,
          React.createElement("h3", null, "Tagesroute auf der Karte"),
          React.createElement("iframe", {
            className: "day-card-map",
            src: mapSrc,
            loading: "lazy",
            referrerPolicy: "no-referrer-when-downgrade",
            title: `Karte für Tag ${tagData.tag}`
          })
        )
      )
    )
  );
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);
  const [activeDay, setActiveDay] = useState(null);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleDayClick = dayTag => {
    setActiveDay(activeDay === dayTag ? null : dayTag);
  };

  return React.createElement("div", { className: "container" },
    React.createElement("header", { className: "header" },
      React.createElement("button", { onClick: () => setIsDarkMode(!isDarkMode), className: "dark-mode-toggle", title: "Dark Mode umschalten" }, isDarkMode ? 'Licht' : 'Dunkel'),
      React.createElement("h1", null, "Schottland 2025"),
      React.createElement("p", null, "Interaktiver Reiseplaner für Chrissy & Jan-Felix")
    ),
    React.createElement("main", null,
      React.createElement("h3", null, "Gesamtübersicht der Reise-Etappen"),
      React.createElement(GesamtroutenKarte, null),
      React.createElement("div", { className: "info-box" },
        React.createElement("div", { className: "info-block" },
          React.createElement("div", { className: "info-block-icon" }, "Camper:"),
          React.createElement("div", null,
            React.createElement("div", { className: "info-block-title" },
              React.createElement("span", null, "Camper Abholung & Rückgabe: Spaceships Rentals"),
              React.createElement("span", { className: "link-icons" },
                React.createElement("a", { href: createGoogleMapsLink("Spaceships Rentals, Old Liston, Edinburgh EH29 9NR"), target: "_blank", rel: "noopener noreferrer", title: "Navigation zu Spaceships Rentals starten" }, "(Karte)"),
                React.createElement("a", { href: "https://www.spaceshipsrentals.co.uk/contact-us/", target: "_blank", rel: "noopener noreferrer", title: "Website von Spaceships Rentals öffnen" }, "(Web)")
              )
            ),
            React.createElement("div", { className: "info-block-desc" }, "Euer Abenteuer beginnt und endet hier. Plant am letzten Tag genug Zeit für die Rückgabe ein!")
          )
        )
      ),
      React.createElement("h3", null, "Tages-Etappen"),
      REISEPLAN_DATEN.map(tag => React.createElement(Tageskarte, { key: tag.tag, tagData: tag, isActive: activeDay === tag.tag, onHeaderClick: () => handleDayClick(tag.tag) }))
    ),
    React.createElement("footer", { className: "footer" },
      React.createElement("p", null, "Gute Reise und unvergessliche Erlebnisse in Schottland!")
    )
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App, null));
