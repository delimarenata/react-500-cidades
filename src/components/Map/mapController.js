
export const startMap = ({
    state, mapRef
  }) => {
    console.log('mapaaaaa', mapRef.current);
    const brazilBounds = {
      west: -73.9872354804, south: -33.7683777809, east: -34.7299934555, north: 5.24448639569
    }
    const location = state.user ? state.user.address : {};
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
  };
  
  export const insertPins = ({ allusers, mapRef}) => {
    const infoWindow = new window.google.maps.InfoWindow();
  
    // window.google.maps.Marker.prototype.getDraggable = function () { return true };
    const markers = allusers.map(agent => {
      const marker = new window.google.maps.Marker({
        position: { lat: agent.address.latitude, lng: agent.address.longitude },
      });
      marker.addListener('click', () => {
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
      });
      return marker;
    });
    
    var markerCluster = new window.MarkerClusterer(mapRef.current, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  };

  