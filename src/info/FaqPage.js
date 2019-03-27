import React, { Component } from "react";
import { Grid, Card, CardContent } from "@material-ui/core";

class FaqPage extends Component {
  render() {
    return (
      <Grid container direction="column">
        <Grid item>
          <h1 className="page-title" style={{ paddingTop: "1em" }}>Frequently asked questions</h1>
        </Grid>
        <Grid
          item
          container
          className="faq-container"
          direction="column"
          spacing="16"
          alignItems="stretch"
        >
          <Grid item>
            <Card>
              <CardContent>
                <h3>How should I describe clips?</h3>
                <p>
                  There are many ways you could describe a clip, we want you to
                  make up your own, but if you're stuck, here are some examples.
                  You could use the names of the things you hear (as
                  specifically or generally as you like), general descriptions
                  of the scene, the time of day or year you think it is, even
                  how it makes you feel. Here are some examples, by no means
                  exhaustive, of each of those categories:
                </p>
                <ul>
                  <li>
                    Animals – bird, songbird, sparrow, white-crowned sparrow,
                    gambel's white crowned sparrow
                  </li>
                  <li>
                    Human-generated sounds – airplane, helicopter, drilling,
                    engine, rumbling
                  </li>
                  <li>
                    Weather – wind, rain, thunder, gale, drizzle, dripping,
                    stream, river
                  </li>
                  <li>Scenes – quiet night, dawn chorus</li>
                  <li>
                    Time – summer, winter, june, august afternoon, night, dawn
                  </li>
                  <li>Feelings – calm, busy, soothing, loud, cacophonous</li>
                </ul>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardContent>
                <h3>Can I input more than one tag at a time?</h3>
                <p>Yes, separate your tags with commas.</p>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardContent>
                <h3>What's a good strategy to use?</h3>
                <p>
                  If you want to earn some points quickly, you can try to guess
                  the obvious labels for a clip. Someone else has probably
                  already used them, so you might get 1 point or you might get 0
                  points, depending on how many people have used them already.
                  If you're feeling more patient, you can tag a clip with a
                  slightly less obvious, more creative, or more subjective
                  label, so you'll have a better chance of being the first
                  person to use that tag. You won't get any points initially,
                  but when someone else comes along and uses it too, you'll get
                  2 points. You'd be surprised how frequently other people are
                  thinking the same thing as you. Just remember that every time
                  one user scores a single point, another user has just scored
                  two.
                </p>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardContent>
                <h3>
                  Does it matter how I capitalize, punctuate, or spell words?
                </h3>
                <p>
                  Not much. Our matching algorithm is clever enough to handle
                  these and give you credit for matching other players' tags
                  that differ in capitalization, punctuation, and spelling
                </p>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardContent>
                <h3>I found a clip that won't play</h3>
                <p>
                  If you press the play button and it jumps right back to "play"
                  mode without playing anything, you've probably found a broken
                  clip. If you could tag it "won't play", we'll remove it from
                  the game as quickly as we can.
                </p>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardContent>
                <h3>
                  I tried using my browser's back button to go back to my last
                  clip, but it seems to be acting funny
                </h3>
                <p>
                  That's intentional. Once you've gone to the summary page, you
                  can go back and listen to your last clip (which you can do
                  that from the summary page anyway), but you can't tag it any
                  more. Any tags you try to submit will be ignored. Only go to
                  the summary page once you're finished tagging your current
                  clip. This is to prevent people from looking at the artist
                  name or other metadata when they're tagging a clip.
                </p>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default FaqPage;
