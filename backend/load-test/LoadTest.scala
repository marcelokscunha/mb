import io.gatling.core.Predef._ // 2
import io.gatling.http.Predef._
import scala.concurrent.duration._

class LoadTest extends Simulation {

  val httpConf = http

    .baseURL("https://gu8mm28yj2.execute-api.us-east-1.amazonaws.com/prod/")
    .acceptHeader(HttpHeaderValues.ApplicationJson)
    .acceptLanguageHeader("en-US,en;q=0.5")
    .header(HttpHeaderNames.ContentType, HttpHeaderValues.ApplicationJson)
    
    //.header(HttpHeaderNames.Authorization, "test-user")

    .userAgentHeader("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36")


  val scn = scenario("List Trips")
    .exec(
      http("List Trips").get("/trips")
    )

    // Run test scenario ramping it to 300 users over 2 minutes.
    setUp(
      scn.inject(rampUsers(300) over (60 * 2 seconds))
    ).protocols(httpConf)
}

//curl -i -H "Accept: application/json" -X GET https://gu8mm28yj2.execute-api.us-east-1.amazonaws.com/prod/trips

// ./bin/gatling.sh -s LoadTest
