import React, { Component } from "react";
import { Redirect } from 'react-router';
import API from "../utils/API";
import { Input, FormBtn } from "../components/Form";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import DeleteBtn from "../components/DeleteBtn";
import SaveBtn from "../components/SaveBtn";
import Panel from "../components/Panel";

class Events extends Component {
  // Setting the component's initial state
  constructor(props) {
    super(props);
    this.state = {
        events: [],
        savedEvents: [],
        title: "",
        date: "",
        time: "",
        description: "",
        street: "",
        city:"",
        state: "",
        zip: "",
        contact: "",
        owner: ""
    };
  }

  componentDidMount() {
    var token = window.localStorage.getItem('token');

    this.loadEvents();

    if (token) {
      API.memberInfo(token)
        .then(res => {
          this.setState({ owner: res.data._id });
          //Update the Login/log out Button
          document.getElementById("logInBttn").innerHTML = "<p>Log Out</p>";

          this.loadSavedEvents();
      })
      .catch(err => console.log(err));
    }
    else{
      return (<Redirect to="../Userlogin" />);
      
    }

  }
  
  loadEvents = () => {
    API.getEvents()
      .then(res =>
        this.setState({ events: res.data })
      )
      .catch(err => console.log(err));
  };

  loadSavedEvents = () => {
    if (this.state.owner){
      API.getSavedEvents(this.state.owner)
        .then(res =>
          this.setState({ savedEvents: res.data })
        )
        .catch(err => console.log(err));
    }
    else{
      console.log("Need to add Log in");
    }
  };

  saveEvent = event => {
    if (this.state.owner){
      API.saveEvent({
          title: event.title,
          date: event.date,
          contact: event.contact,
          eventId: event._id,
          userId: this.state.owner
        })
        .then(res => {
            this.loadEvents(); 
            this.loadSavedEvents();})
        .catch(err => console.log(err));
      }
    else{
      console.log("You need to log in to save")
    }
  };

  deleteEvent = id => {
    API.deleteEvent(id)
      .then(res => this.loadSavedEvents())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    let value = event.target.value;
    const name = event.target.name;
    this.setState({
        [name]: value
      });
  };
  
  handleFormSubmit = event => {
    event.preventDefault();
    console.log(this.state.owner);
    if (this.state.title && this.state.date){
      API.addEvent({
        title: this.state.title,
        date: this.state.date,
        description: this.state.description,
        street: this.state.street,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        contact: this.state.contact,
        owner: this.state.owner,
      })
      .then(res => {
        console.log(res);
        if (res.data.success === false) {
          setTimeout(() => {
            alert("Add Event failed.  Try again");
          }, 1000);
        } 
        else{
          this.setState({ 
            title: '',
            date: '',
            description: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            contact: '',
            owner: ''});
            this.loadEvents();
        }
      })
      .catch(err => console.log(err));
    }
  }
// scr utility api... axios method
  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-7">
            <Panel icon="fa fa-list-alt" heading="Enter New Event">
              <form className="eventsForm">
                  <label>Title:</label><br />
                  <Input type="text" 
                  value={this.state.title} 
                  onChange={this.handleInputChange}
                  name = "title" 
                  placeholder="Enter the title of your event" />
                <label>Date:</label><br />
                <Input type="datetime-local" 
                  value={this.state.date} 
                  onChange={this.handleInputChange}
                  name = "date"  
                  placeholder="Enter the date of your event" />

                <label>Description:</label><br />
                <textarea 
                  value={this.state.description} 
                  onChange={this.handleInputChange} 
                  name="description"
                  placeholder="Enter details of your event"></textarea>

                <label>Street:</label><br />
                <textarea 
                  value={this.state.street} 
                  onChange={this.handleInputChange} 
                  name="street"
                  placeholder="Enter street of your event"></textarea>

                <label>City:</label><br />
                <Input type="text" 
                  value={this.state.city} 
                  onChange={this.handleInputChange}
                  name="city" 
                  placeholder="Enter city of your event"/>

                <label>State:</label><br />
                <Input type="text" 
                  value={this.state.state} 
                  onChange={this.handleInputChange} 
                  name="state"
                  placeholder="Enter State of your event"/>
                <label>ZIP:</label><br />
                <Input type="text" 
                  value={this.state.zip} 
                  onChange={this.handleInputChange}
                  name="zip" 
                  placeholder="Enter zip code of your event"/>
                <label>Contact Info:</label><br /> 
                <Input type="text" 
                  value={this.state.contact} 
                  onChange={this.handleInputChange}
                  name="contact" 
                  placeholder="Enter contact info of your event" />
                <FormBtn
                  disabled={!(this.state.title && this.state.date)}
                  onClick={this.handleFormSubmit}
                >
                Submit Event
              </FormBtn>                
              </form>
            </Panel>
          </Col>
           <Col size="md-5">
            <Row>
              <Panel icon="fa fa-floppy-o" heading="Events Available">
                {this.state.events.length ? (
                  <List>
                    {this.state.events.map(event => (
                      <ListItem key={event._id}>
                        <strong>{event.title}</strong> <i>planned on</i> {event.date}
                        <SaveBtn onClick={() => this.saveEvent(event)} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <h3>No Events Entered</h3>
                )}
              </Panel>
            </Row>
            <Row>
              {this.state.owner ? (
                <Panel icon="fa fa-floppy-o" heading="Saved Events">
                  {this.state.savedEvents.length ? (
                    <List>
                      {this.state.savedEvents.map(event => (
                        <ListItem key={event._id}>
                          <strong>{event.title}</strong> <i>planned on</i> {event.date}
                          <DeleteBtn onClick={() => this.deleteEvent(event._id)} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <h3>No Saved Events</h3>
                  )}
                </Panel>
                ) : ("")
              }
            </Row>            
          </Col>
        </Row>
      </Container>
    )
  }
}
export default Events;      