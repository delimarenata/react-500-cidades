import pin from '../../assets/marcador-oportunidade.svg';

export const startMap = ({
  state, mapRef, setAutocomplete, searchInputRef,
}) => {
  const brazilBounds = {
    west: -73.9872354804, south: -33.7683777809, east: -34.7299934555, north: 5.24448639569
  }
  const location = state.user ? state.user.address : {};
  console.log('location:', location)
  mapRef.current = new window.google.maps.Map(document.getElementById('map'), {
    center: {
      lat: location.latitude || -23.543095,
      lng: location.longitude || -46.627235,
    },
    zoom: 12,
    restriction: {
      latLngBounds: brazilBounds,
      strictBounds: false
    },
    mapTypeControl: false,
    streetViewControl: false
  });
  setAutocomplete(new window.google.maps.places.Autocomplete(searchInputRef.current));
};

export const insertPins = ({ allusers, mapRef }) => {
  const infoWindow = new window.google.maps.InfoWindow();

  const markers = allusers.map(agent => {
    const marker = new window.google.maps.Marker({
      position: { lat: agent.address.latitude, lng: agent.address.longitude },
      icon: pin,
      map: mapRef.current
    });
    return marker.addListener('click', () => {
      const skill = agent.skills.map((skill, index) => `<div class='agent-skills-item' id=${index}>${skill}</div>`).join('');

      infoWindow.setContent(`
        <div class='info-window'>
          <div class='agent-info'>
            <div class='userinfo'>
              <img
                class='user-info-img'
                alt="user-photo"
                src=${agent.profile_image.mimified}
              >
            </div>
            <div>
              <p class='agent-info--text1'>${agent.name}</p>
              <p class='agent-info--text2'>${agent.address.city} / ${agent.address.state}</p>
              <p class='agent-info--text3'>${agent.job}</p>
            </div>
          </div>
          <div class='agent-skills'>${skill}</div>
          <button class='btn-ver-mais' type="button" onclick="document.getElementById('${agent.id}').click()" class='agent-plus'>Ver Mais</button>
        </div>`
      )
      return infoWindow.open(mapRef.current, marker)
    })
  });
  
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line no-undef
  var markerCluster = new window.MarkerClusterer(mapRef.current, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  console.log('markerCluster:', markerCluster);
}

export const fetchAutocomplete = ({ autocomplete, mapRef, dispatch }) => {
  autocomplete.bindTo('bounds', mapRef.current);
  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      dispatch({
        type: 'SHOW_TOAST',
        data: {
          error: true,
          msg: "endereço não encontrado"
        }
      })
      return;
    }
    if (place.geometry.viewport) {
      mapRef.current.fitBounds(place.geometry.viewport);
    } else {
      mapRef.current.setCenter(place.geometry.location);
      mapRef.current.setZoom(17);
    }
  });
};
