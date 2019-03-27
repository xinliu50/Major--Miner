import React, { Component } from "react";

class PrivacyPage extends Component {
  render() {
    return (
      <div className="privacy-container">
        <h1 className="page-title">Privacy and Participation</h1>
        <p>
          You are being asked to participate in this research study because you
          are an adult at least 18 years of age. The purpose of this research
          study is to collect descriptions of sounds from people, so that we can
          train computer models to automatically describe new sounds. If you
          agree to participate, we will ask you to listen to sounds and provide
          free-form textual descriptions of them. Listening to and labeling each
          sound will take less than a minute, and you can do as many or as few
          as you would like, whenever you would like. Research-related risks to
          you are minimal, but include fatigue and exposure to volume variations
          between sounds. We will only record your descriptions, we will not
          record any personally identifiable information from you and will only
          identify you within our system by a username of your choosing. The
          descriptions that we collect will be stored on our servers at Brooklyn
          College and made available to other researchers for the same purpose.
          Your participation in this research is voluntary. If you have any
          questions, you can contact Michael Mandel at{" "}
          <a
            target="_blank"
            href="mailto:mim@sci.brooklyn.cuny.edu"
            rel="noopener noreferrer"
          >
            mim@sci.brooklyn.cuny.edu
          </a>
          or 718.951.5000 x2053. If you have any questions about your rights as
          a research participant or if you would like to talk to someone other
          than the researchers, you can contact CUNY Research Compliance
          Administrator at 646-664-8918 or{" "}
          <a
            target="_blank"
            href="mailto:HRPP@cuny.edu"
            rel="noopener noreferrer"
          >
            HRPP@cuny.edu
          </a>
          .
        </p>
      </div>
    );
  }
}

export default PrivacyPage;
