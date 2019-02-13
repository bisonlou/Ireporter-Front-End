var image_collection;
var lat = 32.5825;
var lng = 0.3476;

mapboxgl.accessToken = 'pk.eyJ1IjoiYmlzb25sb3UiLCJhIjoiY2pzMWVhNTZpMW5hZTN5bzV2cmxiZjdwYyJ9.6c7qPz7pGzqn0ntIyXkZXw';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [32.5825, 0.3476],
  zoom: 6
});

var canvas = map.getCanvasContainer();

var geojson = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [32.5825, 0.3476]
    }
  }]
};

function onMove(e) {
  var coords = e.lngLat;

  // Set a UI indicator for dragging.
  canvas.style.cursor = 'grabbing';

  // Update the Point feature in `geojson` coordinates
  // and call setData to the source layer `point` on it.
  geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
  map.getSource('point').setData(geojson);
}

function onUp(e) {
  var coords = e.lngLat;

  // Print the coordinates of where the point had
  // finished being dragged to on the map.
  lng = coords.lng
  lat = coords.lat;
  canvas.style.cursor = '';

  // Unbind mouse/touch events
  map.off('mousemove', onMove);
  map.off('touchmove', onMove);
}

map.on('load', function () {

  // Add a single point to the map
  map.addSource('point', {
    "type": "geojson",
    "data": geojson
  });

  map.addLayer({
    "id": "point",
    "type": "circle",
    "source": "point",
    "paint": {
      "circle-radius": 10,
      "circle-color": "#3887be"
    }
  });

  // When the cursor enters a feature in the point layer, prepare for dragging.
  map.on('mouseenter', 'point', function () {
    map.setPaintProperty('point', 'circle-color', '#3bb2d0');
    canvas.style.cursor = 'move';
  });

  map.on('mouseleave', 'point', function () {
    map.setPaintProperty('point', 'circle-color', '#3887be');
    canvas.style.cursor = '';
  });

  map.on('mousedown', 'point', function (e) {
    // Prevent the default map drag behavior.
    e.preventDefault();

    canvas.style.cursor = 'grab';

    map.on('mousemove', onMove);
    map.once('mouseup', onUp);
  });

  map.on('touchstart', 'point', function (e) {
    if (e.points.length !== 1) return;

    // Prevent the default map drag behavior.
    e.preventDefault();

    map.on('touchmove', onMove);
    map.once('touchend', onUp);
  });
});

function register() {
  const url = 'https://knightedge.herokuapp.com/api/v1/auth/signup';
  // const url = 'http://127.0.0.1:5000/api/v1/auth/signup';
  required_fields = ['username', 'email', 'firstname', 'lastname', 'phonenumber', 'password'];

  if (validate_required(required_fields) > 0) {
    return
  }

  if (validate_passwords_match() == false) {
    return
  }

  let headers = get_headers()
  let body = JSON.stringify({
    'user_name': get_element_value('username'),
    'email': get_element_value('email'),
    'first_name': get_element_value('firstname'),
    'last_name': get_element_value('lastname'),
    'phone_number': get_element_value('phonenumber'),
    'password': get_element_value('password'),
    'other_names': get_element_value('othernames'),
    'is_admin': false
  })

  fetch(url, {
    method: 'post',
    headers: headers,
    body: body
  })
    .then(response => {
      return response.json();
    }).then(data => {
      if (data['status'] == 201) {
        set_cookie(data);
        navigate_to("home.html");
      }
      else {
        display_errors(data);
      }
    }).catch(err => {
      console.log(err);
    });
}

function login() {

  required_fields = ['email', 'password'];

  if (validate_required(required_fields) > 0) {
    return
  }
  const url = 'https://knightedge.herokuapp.com/api/v1/auth/login';
  // const url = 'http://127.0.0.1:5000/api/v1/auth/login';

  body = JSON.stringify({
    'email': get_element_value('email'),
    'password': get_element_value('password')
  });

  fetch(url, {
    method: 'post',
    headers: get_headers(),
    body: body
  })
    .then(response => {
      return response.json();
    }).then(data => {
      if (data['status'] == 200) {
        set_cookie(data);
        navigate_to("home.html");
      }
      else {
        display_errors(data);
      }

    }).catch(err => {
      console.log(err);

    });
}

function getIndexData() {
  displayUserName();
  getRedflags();
  getInterventions();
}

function displayUserName() {

  const url = 'https://knightedge.herokuapp.com/api/v1/auth/users';
  // const url = 'http://127.0.0.1:5000/api/v1/auth/users';

  fetch(url, {
    headers: get_headers()
  })

    .then(response => {
      return response.json();
    }).then(data => {
      account_name = get_element('account-name');
      account_name.innerHTML = data['data'][0]['username'];

    }).catch(err => {
      console.log(err);
    });
}

function getRedflags() {
  const url = 'https://knightedge.herokuapp.com/api/v1/redflags';
  // const url = 'http://127.0.0.1:5000/api/v1/redflags';

  fetch(url, {
    headers: get_headers()
  })

    .then(response => {
      return response.json();
    }).then(data => {

      if (data['status'] == 401) {
        navigate_to('login.html');
      }

      const table = get_element('redflag-table');
      populate_incident_table(data, table, 'red-flag')
      update_dashboard(data, 'red-flag');

    }).catch(err => {
      console.log(err);
    });
}

function getInterventions() {
  const url = 'https://knightedge.herokuapp.com/api/v1/interventions';
  // const url = 'http://127.0.0.1:5000/api/v1/interventions';

  fetch(url, {
    headers: get_headers()
  })

    .then(response => {
      return response.json();
    }).then(data => {

      if (data['status'] == 401) {
        navigate_to('login.html');
      }

      const table = document.getElementById('intervention-table');
      populate_incident_table(data, table, 'intervention');
      update_dashboard(data, 'intervention')

    }).catch(err => {
      console.log(err);
    });
}



function postIncident(incidentType) {

  if (validateIncident() == false) {
    return
  }

  url = 'https://knightedge.herokuapp.com/api/v1/incidents';
  // url = 'http://127.0.0.1:5000/api/v1/incidents';
//  
  let body = JSON.stringify({
    'title': get_element_value('title'),
    'comment': get_element_value('comment'),
    'latitude': lat,
    'longitude': lng,
    'type': incidentType
  })

  fetch(url, {
    method: 'post',
    body: body,
    headers: get_headers()
  })

    .then(response => {
      return response.json();
    }).then(data => {
      if (data['status'] == 201) {
        let incident_id = data['data'][0]['id'];
        upload_images(incident_id);
        displayAlert();
      }
    }).then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
}

function upload_images(incident_id) {
  if (image_collection != null) {
    for (i = 0; i < image_collection.length; i++) {
      form_data = new FormData();
      file = image_collection[i];

      form_data.append("image", file, file.name);
      url = 'https://knightedge.herokuapp.com/api/v1/incidents/' + incident_id + '/addImage';
      // url ='http://127.0.0.1:5000/api/v1/incidents/' + incident_id + '/addImage';

      fetch(url, {
        method: 'patch',
        body: form_data,
        headers: {
          'Authorization': document.cookie
        }
      });
    }
  }
}



function displayImages(files) {
  let i = 0
  image_collection = files;
  numFiles = files.length;
  var table = get_element('images_table')

  for (i; i < numFiles; i++) {
    const file = files[i];

    var row = table.insertRow(i);

    var name_cell = row.insertCell(0);
    var delete_cell = row.insertCell(1);

    file_name = file.name;
    name_cell.innerHTML = file_name;
    delete_cell.innerHTML = '<a href="#">Delete</a>';

  }
}


function putIncident() {
  let current_url = window.location.href;
  let incidentType = /type=([^&]+)/.exec(current_url)[1];
  let incidentId = /id=([^&]+)/.exec(current_url)[1];
  incidentId = parseInt(incidentId, 10)

  url = 'https://knightedge.herokuapp.com/api/v1/incidents/' + incidentId;
  // url ='http://127.0.0.1:5000/api/v1/incidents/' + incidentId;

  let body = JSON.stringify({
    'title': get_element_value('title'),
    'comment': get_element_value('comment'),
    'latitude': lat,
    'longitude': lng,
    'type': incidentType,
    'status': 'pending'
  })

  fetch(url, {
    method: 'put',
    body: body,
    headers: get_headers()
  })

    .then(response => {
      return response.json();
    }).then(data => {
      if (data['status'] == 200) {
        let incident_id = data['data'][0]['id'];
        upload_images(incident_id);
        displayAlert();
      }
    }).catch(err => {
      console.log(err);
    });
}

function getIncident() {
  let current_url = window.location.href;
  let incidentType = /type=([^&]+)/.exec(current_url)[1];
  let incidentId = /id=([^&]+)/.exec(current_url)[1];
  incidentId = parseInt(incidentId, 10)

  let title = get_element('title');
  let comment = get_element('comment');

  var url = '';
  if (incidentType == 'red-flag') {
    url = 'https://knightedge.herokuapp.com/api/v1/redflags/' + incidentId;
    // url = url = 'http://127.0.0.1:5000/api/v1/redflags/' + incidentId;
  }
  if (incidentType == 'intervention') {
    url = 'https://knightedge.herokuapp.com/api/v1/interventions/' + incidentId;
    // url = 'http://127.0.0.1:5000/api/v1/interventions/' + incidentId;
  }

  fetch(url, {
    method: 'get',
    headers: get_headers()
  })

    .then(response => {
      return response.json();
    }).then(data => {
      title.value = data['data'][0]['title'];
      comment.innerHTML = data['data'][0]['comment'];

      table = get_element('images-table')
      populate_images_table(data, table)

    }).catch(err => {
      console.log(err);
    });

}

function deleteIncident() {
  let current_url = window.location.href;
  let incidentId = /id=([^&]+)/.exec(current_url)[1];
  incidentId = parseInt(incidentId, 10)


  url = 'https://knightedge.herokuapp.com/api/v1/incidents/' + incidentId;
  // url = url = 'http://127.0.0.1:5000/api/v1/incidents/' + incidentId;

  fetch(url, {
    method: 'delete',
    headers: get_headers()
  })

    .then(response => {
      return response.json();
    }).then(data => {
      if (data['status'] == 200) {
        navigate_to('home.html');
      }
    }).catch(err => {
      console.log(err);
    });

}

function logout() {
  delete_cookie()
  navigate_to('login.html')
}

function get_headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': document.cookie
  }
}


function set_cookie(data) {
  let token = data['data'][0]['access_token'];
  let bearer_token = "Bearer " + token + ";";
  document.cookie = "token=" + bearer_token;
}


function delete_cookie(data) {
  document.cookie = "token=";
}


function get_element_value(element_id) {
  return document.getElementById(element_id).value
}

function get_element(element_id) {
  return document.getElementById(element_id)
}

function check_passwords_match() {
  if (get_element_value('password') != get_element_value('confirm_password')) {
    data = { 'errors': ['Passwords do not match'] };
    display_errors(data);

    return
  }
}

function display_errors(data) {
  error_box = get_element('error-box');
  while (error_box.firstChild) {
    error_box.style.display = "none";
    error_box.removeChild(error_box.firstChild);
  }
  errors = data['errors'];
  error_box.style.display = "block";

  for (i = 0; i < errors.length; i++) {
    paragraph = document.createElement("P");
    error = document.createTextNode(errors[i]);

    paragraph.appendChild(error);
    error_box.appendChild(paragraph);
  }
}


function displayAlert() {
  alert = get_element('alert-box');
  alert.style.display = "block";
}


function navigate_to(page) {
  window.location.href = "https://bisonlou.github.io/Challenge-IV/UI/" + page ;
  // window.location.href = "http://localhost/iReporter/" + page;
}


function populate_images_table(data, table) {
  for (i = 0; i < (data['data'][0]['images']).length; i++) {
    var row = table.insertRow(i);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = data['data'][0]['images'][i];
    cell2.innerHTML = '<a href="#">Delete</a>';

  }
}

function populate_incident_table(data, table, type) {
  for (i = 0; i < (data['data'][0]).length; i++) {
    var row = table.insertRow(i + 1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    incidentId = data['data'][0][i]['id'];
    long_date_time = new Date(data['data'][0][i]['createdon']);

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

    month = months[long_date_time.getMonth()];
    day = days[long_date_time.getDay()];
    year = long_date_time.getFullYear();
    date = long_date_time.getDate();

    if (date < 10) {
      date = "0" + date;
    }

    display_date = day + " " + date + " " + month + " " + year;

    cell1.innerHTML = display_date;
    cell2.innerHTML = data['data'][0][i]['title'];
    cell3.innerHTML = data['data'][0][i]['status'];
    cell4.innerHTML = '<a href="./incident_edit.html?type=' + type + '&id=' + incidentId +
      '">Edit</a> | <a href="./incident_confirm_delete.html?type=' + type + '&id=' + incidentId +
      '">Delete</a>';

  }
}

function update_dashboard(data, type) {
  if (type == 'red-flag') {

    get_element('total-redflags').innerHTML = data['totals']['total']['count'];
    get_element('pending-redflags').innerHTML = data['totals']['pending']['count'];
    get_element('rejected-redflags').innerHTML = data['totals']['rejected']['count'];

  }
  if (type == 'intervention') {

    get_element('total-interventions').innerHTML = data['totals']['total']['count'];
    get_element('pending-interventions').innerHTML = data['totals']['pending']['count'];
    get_element('rejected-interventions').innerHTML = data['totals']['rejected']['count'];

  }
}

function validateIncident() {
  title = get_element_value('title')
  comment = get_element_value('comment')
  error_box = get_element('error-box');

  while (error_box.firstChild) {
    error_box.style.display = "none";
    error_box.removeChild(error_box.firstChild);
  }

  if (title == '') {
    error_box.style.display = "block";

    paragraph = document.createElement("P");
    error = document.createTextNode('Please give a title');

    paragraph.appendChild(error);
    error_box.appendChild(paragraph);
    return false;
  }
  if (comment == '') {
    error_box.style.display = "block";

    paragraph = document.createElement("P");
    error = document.createTextNode('Please leave a comment');

    paragraph.appendChild(error);
    error_box.appendChild(paragraph);
    return false;
  }
  return true;
}

function validate_required(required_fields) {
  let empty_field_count = 0;
  for (i = 0; i < required_fields.length; i++) {
    error_label = get_element(required_fields[i] + '-error')
    element_value = get_element_value(required_fields[i])

    if (element_value == '') {
      empty_field_count += 1;
      error_label.innerHTML = 'This field is required';
    }
  }
  return empty_field_count
}

function validate_passwords_match() {
  password = get_element_value('password')
  confirm_password = get_element_value('confirm_password')

  if (confirm_password != password) {
    get_element('confirm_password-error').innerHTML = 'passwords don not match';
    return flase
  }
  return true
}
