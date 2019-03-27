import React, { Component } from 'react';

class IntroPage extends Component {
  render() {
    return (
      <div>
        <h1>Sound Labeling Game</h1>
        <p>
          Welcome to MajorMiner's environmental sound labeling game.  The goal of the
          game, besides just listening to interesting soundscapes, is to label them with
          <strong>original</strong>, yet <strong>relevant</strong> words and
          phrases that other players <strong>agree with</strong>.  We're going
          to use your descriptions to teach our computers to recognize these 
          same sounds in over 100,000 hours of recordings so that we can better 
          understand the behavior of animals and how it is affected by human activity.
        </p>
        <h3>The rules</h3>
        <ul>
          <li>
            You will be presented with one randomly selected 10-second sound
            clip at a time.
          </li>
          <li>
            Describe that clip with a word or phrase (we call them "tags",
            here are some examples (LINK TO FAQ!!))
            and <strong>press enter</strong>.
          </li>
          <li>
            If you're the first person to describe that clip with that tag,
            you'll get <span class="points-2">2 points</span> when the next
            person tags that clip with that tag.
          </li>
          <li>
            If you're the second person to describe that clip with that tag,
            you'll get <span class="points-1">1 point</span> immediately.
          </li>
          <li>
            If more than two people have already tagged that clip with that
            tag, you <span class="points-0">won't get any points</span>,
            but you can try another tag.
          </li>
          <li>
            Tag each clip as many times as you want, follow one of the "new
            clip" links to listen to a new one.
          </li>
        </ul>
      </div>
    );
  }
}

export default IntroPage;