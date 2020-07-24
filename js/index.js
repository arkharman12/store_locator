let map;
let markers = [];
let infoWindow;

// let input = document.getElementById("zip-code-input");
// input.addEventListener("keyup", function(event) {
//   if (event.keyCode === 13) {
//    event.preventDefault();
//    document.getElementById("search-icon").click();
//   }
// });

function initMap() {
    let losAngeles = {
        lat: 34.063380, 
        lng: -118.358080
    };
  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 11,
    mapTypeId: 'roadmap'
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores();
}

function searchStores() {
    let foundStores = [];
    // let zipCode = document.getElementById("zip-code-input").value;
    let e = document.getElementById("zip-select");
    let zipCode = e.options[e.selectedIndex].text;

    if(zipCode) {
        for(let store of stores) {
            let postal = store["address"]["postalCode"].substring(0, 5);
            if(zipCode == postal) {
                foundStores.push(store);
            }
        }
    } 
    if(zipCode == "Select Zip Code" || zipCode == "Show all #") {
        foundStores = stores;
    }

    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListner();
}


function setOnClickListner() {
    let storeElements = document.querySelectorAll(".store-container");
    for(let [index, storeElement] of storeElements.entries()) {
        storeElement.addEventListener("click", function() {
            google.maps.event.trigger(markers[index], "click");
        })
    }
}

function displayStores(stores) {
    let storesHtml = "";
    for(let [index, store] of stores.entries()) {
        let address = store["addressLines"];
        let phone = store["phoneNumber"];
        storesHtml += `
        <div class="store-container">
            <div class="store-container-background">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${address[0]}</span> 
                        <span>${address[1]}</span>
                    </div>
                    <div class="store-phone-number">${phone}</div>
                </div>
            
                <div class="store-number-container">
                    <div class="store-number">
                        ${index + 1} 
                    </div>
                </div>
            </div>
        </div>
        `;
        document.querySelector(".stores-list").innerHTML = storesHtml;
    }
}

function showStoresMarkers(stores) {
    let bounds = new google.maps.LatLngBounds();
    for(let [index, store] of stores.entries()) {

        let latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);

        let name = store["name"];
        let address = store["addressLines"][0];
        let gMapsAddress = store["addressLines"][0] + " " + store["addressLines"][1];
        let openStatusText = store["openStatusText"];
        let phoneNumber = store["phoneNumber"];

        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phoneNumber, index + 1, gMapsAddress);
    }
    map.fitBounds(bounds);
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function createMarker(latlng, name, address, openStatusText, phoneNumber, index, gMapsAddress) {
    let html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                <a href="http://maps.google.com/?q=${gMapsAddress}" target="_blank">${address}</a>
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${phoneNumber}
            </div>
        </div>
    
    `;
    let marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: String(index)
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}


