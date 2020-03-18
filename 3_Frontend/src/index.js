import React from "react";
import ReactDOM from "react-dom";
import mystyle from "./css/mystyle.css";
import normalize from "./css/normalize.css";
import skeleton from "./css/skeleton.css"; 

// Note: I moved the React Components that represents content to its own js file
// pages.js
import {HomePage, AboutUsPage, ContactUsPage, ContactUsSubmissions, BlogPost1Page, BlogPost2Page, BlogPost3Page, BlogPost4Page, BlogPost5Page} from "./pages.js"

class Header extends React.Component {
  render() {
    return (
      <header>
        <span class="menu" onClick={() => this.props.clickSwitch(<HomePage clickSwitch={this.props.clickSwitch}/>)}> <a> Home Page </a></span>
        <span class="menu" onClick={() => this.props.clickSwitch(<AboutUsPage clickSwitch={this.props.clickSwitch}/>)}> <a> About Us </a></span>
        <span class="menu" onClick={() => this.props.clickSwitch(<ContactUsPage clickSwitch={this.props.clickSwitch} addContact={this.props.addContact}/>)}> <a> Contact Us </a></span>
      </header>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <span class="menu" onClick={() => this.props.clickSwitch(<HomePage clickSwitch={this.props.clickSwitch}/>)}> <a> Home Page </a></span>
        <span class="menu" onClick={() => this.props.clickSwitch(<AboutUsPage clickSwitch={this.props.clickSwitch}/>)}> <a> About Us </a></span>
        <span class="menu" onClick={() => this.props.clickSwitch(<ContactUsPage clickSwitch={this.props.clickSwitch} addContact={this.props.addContact}/>)}> <a> Contact Us </a></span>
        <span class="menu" onClick={() => this.props.clickSwitch(<ContactUsSubmissions clickSwitch={this.props.clickSwitch} allSubmissions={this.props.contactSubmission}/>)}> <a> Contact Us Submissions</a></span>
      </footer>
    );
  }
}

class PageContainer extends React.Component {
// For now, render the home page. However this container would need to switch
// between content pages in the pages.js file
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.entries}
      </div>
    );
  }
}

class App extends React.Component {
  // This component contains the entirety of your application
  constructor(props) {
    super(props);
    this.switchState = this.switchState.bind(this);
    this.addContact = this.addContact.bind(this);
    this.state = {content: <HomePage clickSwitch={this.switchState}/>,
                  contactSubmission: []}
  }
  
  switchState(key) {
    this.setState({
      content: key
      });
  }
  
  addContact(contact) {
    // note: the first parameter passed into this.setState() is always this.state (the current state)
    this.setState((prevState) => {
      var newContactSubmission = prevState.contactSubmission;
      newContactSubmission.push(contact);
      return ({
        contactSubmission: newContactSubmission
      });
      })
  }

  render() {
   return (
     <div>
      <Header clickSwitch={this.switchState} addContact = {this.addContact}/>
      <PageContainer entries={this.state.content} />
      <Footer clickSwitch={this.switchState} addContact = {this.addContact} contactSubmission={this.state.contactSubmission}/>
    </div>
   );
 }
}

// Render the App component, which contains instances of your Add and Subtract Components
ReactDOM.render(
  <App />,
  document.getElementById('root'));
