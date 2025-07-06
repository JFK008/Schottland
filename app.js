"use strict";

const { useEffect, useState } = React;

const createGoogleMapsLink = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const REISEPLAN_DATEN = [
    // ... (ALLE DEINE REISEPLAN_DATEN HIER EINFÜGEN) ...
    // Ich kürze das hier ab, aber du musst den gesamten Inhalt deines Arrays hier reinkopieren.
    // Beispiel für den ersten Tag:
    {
      tag: 1,
      titel: "Ankunft & Edinburgh",
      startOrt: "Spaceships Rentals",
      zielOrt: "Mortonhall Park",
      startCoords: { lat: 55.923, lon: -3.358 },
      zielCoords: { lat: 55.908, lon: -3.193 },
      distanz: "15 km",
      fahrzeit: "30min",
      infos: [{ icon: "Burg", title: "Edinburgh Castle", gmaps: "Edinburgh Castle", web: "https://www.edinburghcastle.scot/", desc: "Das Wahrzeichen der Stadt. Tickets unbedingt 2-3 Wochen vorbuchen!" }, { icon: "Aussicht", title: "Calton Hill", gmaps: "Calton Hill, Edinburgh", web: "https://www.visitscotland.com/info/see-do/calton-hill-p255151", desc: "Leichter Aufstieg für den besten Panoramablick. Perfekt für den Sonnenuntergang." }, { icon: "Essen", title: "Kulinarik-Tipp", desc: "Probiert Haggis, Neeps and Tatties in einem Pub am Grassmarket oder in der Rose Street." }, { icon: "Tipp", title: "Praktischer Hinweis", desc: "Lasst den Camper stehen! Nutzt den Bus ins Zentrum. Kauft ein Tagesticket ('DAYticket')." }]
    },
    // ... und so weiter für alle 12 Tage ...
    {
      tag: 12,
      titel: "Forth Bridges & Abschied",
      startOrt: "St. Andrews",
      zielOrt: "Spaceships Rentals",
      startCoords: { lat: 56.339, lon: -2.796 },
      zielCoords: { lat: 55.923, lon: -3.358 },
      distanz: "75 km",
      fahrzeit: "1h 15min",
      infos: [{ icon: "Brücke", title: "Forth Bridges Viewpoint", gmaps: "Forth Bridges Viewpoint, South Queensferry", web: "https://www.theforthbridges.org/", desc: "Macht einen letzten Stopp, um die drei imposanten Brücken aus drei Jahrhunderten zu bestaunen." }, { icon: "Pause", title: "Letzter Kaffee", gmaps: "Hawes Inn, South Queensferry", web: "https://www.vintageinn.co.uk/restaurants/scotland-northernireland/thehawesinnsouthqueensferry", desc: "Das historische Hawes Inn ist perfekt, um die Reise ausklingen zu lassen." }, { icon: "Camper", title: "Camper-Rückgabe", desc: "Plant genug Zeit ein! Ihr müsst tanken, Wasser ablassen, putzen und auf die Abnahme warten." }]
    }
];

const GesamtroutenKarte = () => {
  const markers = REISEPLAN_DATEN.map(tag => `marker=${tag.zielCoords.lat},${tag.zielCoords.lon},blue${tag.tag}`).join('&');
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=-8.6,54.6,-0.7,59&layer=mapnik&${markers}`;
  return React.createElement("div", { className: "map-container" },
    React.createElement("iframe", { width: "100%", height: "100%", frameBorder: "0", scrolling: "no", marginHeight: "0", marginWidth: "0", src: mapSrc })
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
          React.createElement("iframe", { className: "day-card-map", src: mapSrc, loading: "lazy", referrerPolicy: "no-referrer-when-downgrade", title: `Karte für Tag ${tagData.tag}` })
        )
      )
    )
  );
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    var _window$matchMedia;
    return (_window$matchMedia = window.matchMedia) === null || _window$matchMedia === void 0 ? void 0 : _window$matchMedia.call(window, "(prefers-color-scheme: dark)").matches;
  });
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
