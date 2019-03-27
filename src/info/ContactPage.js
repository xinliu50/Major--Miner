import React, { Component } from "react";

class ContactPage extends Component {
  render() {
    return (
      <div className="contact-container">
        <h1 className="page-title">Contact us</h1>
        <p>
          Please contact us with any questions, comments, congratulations, or
          concerns.
        </p>
        <p>The easiest way is to leave a comment on our blog,</p>
        <a href="http://blog.majorminer.org">blog.majorminer.org</a>
        <p>but email is also welcome:</p>
        <a
          target="_blank"
          href="mailto:info@majorminer.org"
          rel="noopener noreferrer"
        >
          info@majorminer.org
        </a>
      </div>
    );
  }
}

export default ContactPage;
