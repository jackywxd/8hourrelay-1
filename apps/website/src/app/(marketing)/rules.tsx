export default function RulesSection() {
  return (
    <section id="rules" className="rules">
      <h2 className="pb-5">Rules</h2>
      <div className="content-container xlarge">
        <div className="column-right">
          <h3>Open Category</h3>
          <ul>
            <li>
              <details>
                <summary>Forming a team</summary>
                <div>Each team must have exactly 12 members.</div>
                <div>Each team must have no fewer than 4 females.</div>
                <div>Each runner can only run for one team.</div>
              </details>
            </li>
            <li>
              <details>
                <summary>Competition rules</summary>
                <div>
                  Each member of the relay team must run ONE (and ONLY one) leg
                  of the relay.
                </div>
                <div>Each leg of the relay must run 40ish minutes.</div>
                <div>
                  The team that covers the longest distance wins the race.
                </div>
              </details>
            </li>
          </ul>
        </div>
        <div className="column-right">
          <h3>Master Category</h3>
          <ul>
            <li>
              <details>
                <summary>Forming a team</summary>
                <div>Each team must have no more than 24 runners.</div>
                <div>Each runner can only run for one team.</div>
                <div>Each runner must be 18 years of age or older.</div>
              </details>
            </li>
            <li>
              <details>
                <summary>Competition rules</summary>
                <div>
                  Each member of the relay team must run ONE (and ONLY one) leg
                  of the relay, and the team must run a total of 8 hours
                  continuously.
                </div>
                <div>
                  The team that covers the longest distance wins the race.
                </div>
                <div>
                  Each leg of the relay must be no less than 20 minutes.
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>​​Calculating the final result of a team</summary>
                <div>
                  Each team must calculate the weighted coefficient of the team,
                  which is based on each member’s age, gender, and running time
                  entered on the registration form. The team’s weighted
                  coefficient must be reported the day before the race. The
                  team’s distance for record-keeping in determining the winner
                  is calculated as the actual distance covered in the relay by
                  the team and its weighted coefficient.
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Calculating the weighted coefficient</summary>

                <div>
                  The basic coefficient is calculated based on the qualification
                  time for Boston Marathon (BQ) (see the table below – Boston
                  present qualifying times 2020). <br />
                  <br />
                  The coefficient = Marathon BQ time / 200 minutes (see
                  Coefficient Table below).
                  <br />
                  <br />
                  Each team calculates the total coefficient minutes by taking
                  the corresponding coefficient based on each member’s age and
                  gender (from the table below) multiplied by the registered
                  running minutes and adding it up. <br />
                  <br />
                  The weighted coefficient = the total coefficient minutes / 480
                  minutes (rounded up to 4 decimals)
                  <br />
                  <br />
                  The “baton” must be passed from one member to another with a
                  1-minute buffer before or after the designated time. If the
                  “baton” is passed outside the buffer, for each minute earlier
                  or delayed, the team will be penalized by subtracting one
                  kilometer from its covered distance in record keeping. Any
                  time under one minute will be counted as one minute for
                  penalty. <br />
                  <br />
                  For omissions or disputes in the rules of the competition, the
                  organizing committee has the final interpretation and
                  decision-making power.
                  <br />
                  <br />
                  <div className="table-name">Coefficient Table</div>
                  <ul className="coefficient-table mt-5">
                    <li className="table-header">
                      <div>Age</div>
                      <div>Male Marathon BQ Time (min)</div>
                      <div>Male Coefficient</div>
                      <div>Female Marathon BQ Time (min)</div>
                      <div>Female Coefficient</div>
                    </li>
                    <li>
                      <div>18</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>19</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>20</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>21</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>22</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>23</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>24</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>25</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>26</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>27</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>28</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>29</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>30</div>
                      <div>180</div>
                      <div>0.9</div>
                      <div>210</div>
                      <div>1.05</div>
                    </li>
                    <li>
                      <div>31</div>
                      <div>181</div>
                      <div>0.905</div>
                      <div>211</div>
                      <div>1.055</div>
                    </li>
                    <li>
                      <div>32</div>
                      <div>182</div>
                      <div>0.91</div>
                      <div>212</div>
                      <div>1.06</div>
                    </li>
                    <li>
                      <div>33</div>
                      <div>183</div>
                      <div>0.915</div>
                      <div>213</div>
                      <div>1.065</div>
                    </li>
                    <li>
                      <div>34</div>
                      <div>184</div>
                      <div>0.92</div>
                      <div>214</div>
                      <div>1.07</div>
                    </li>
                    <li>
                      <div>35</div>
                      <div>185</div>
                      <div>0.925</div>
                      <div>215</div>
                      <div>1.075</div>
                    </li>
                    <li>
                      <div>36</div>
                      <div>186</div>
                      <div>0.93</div>
                      <div>216</div>
                      <div>1.08</div>
                    </li>
                    <li>
                      <div>37</div>
                      <div>187</div>
                      <div>0.935</div>
                      <div>217</div>
                      <div>1.085</div>
                    </li>
                    <li>
                      <div>38</div>
                      <div>188</div>
                      <div>0.94</div>
                      <div>218</div>
                      <div>1.09</div>
                    </li>
                    <li>
                      <div>39</div>
                      <div>189</div>
                      <div>0.945</div>
                      <div>219</div>
                      <div>1.095</div>
                    </li>
                    <li>
                      <div>40</div>
                      <div>190</div>
                      <div>0.95</div>
                      <div>220</div>
                      <div>1.1</div>
                    </li>
                    <li>
                      <div>41</div>
                      <div>192</div>
                      <div>0.96</div>
                      <div>222</div>
                      <div>1.11</div>
                    </li>
                    <li>
                      <div>42</div>
                      <div>194</div>
                      <div>0.97</div>
                      <div>224</div>
                      <div>1.12</div>
                    </li>
                    <li>
                      <div>43</div>
                      <div>196</div>
                      <div>0.98</div>
                      <div>226</div>
                      <div>1.13</div>
                    </li>
                    <li>
                      <div>44</div>
                      <div>198</div>
                      <div>0.99</div>
                      <div>228</div>
                      <div>1.14</div>
                    </li>
                    <li>
                      <div>45</div>
                      <div>200</div>
                      <div>1</div>
                      <div>230</div>
                      <div>1.15</div>
                    </li>
                    <li>
                      <div>46</div>
                      <div>201</div>
                      <div>1.005</div>
                      <div>231</div>
                      <div>1.155</div>
                    </li>
                    <li>
                      <div>47</div>
                      <div>202</div>
                      <div>1.01</div>
                      <div>232</div>
                      <div>1.16</div>
                    </li>
                    <li>
                      <div>48</div>
                      <div>203</div>
                      <div>1.015</div>
                      <div>233</div>
                      <div>1.165</div>
                    </li>
                    <li>
                      <div>49</div>
                      <div>204</div>
                      <div>1.02</div>
                      <div>234</div>
                      <div>1.17</div>
                    </li>
                    <li>
                      <div>50</div>
                      <div>205</div>
                      <div>1.025</div>
                      <div>235</div>
                      <div>1.175</div>
                    </li>
                    <li>
                      <div>51</div>
                      <div>207</div>
                      <div>1.035</div>
                      <div>237</div>
                      <div>1.185</div>
                    </li>
                    <li>
                      <div>52</div>
                      <div>209</div>
                      <div>1.045</div>
                      <div>239</div>
                      <div>1.195</div>
                    </li>
                    <li>
                      <div>53</div>
                      <div>211</div>
                      <div>1.055</div>
                      <div>241</div>
                      <div>1.205</div>
                    </li>
                    <li>
                      <div>54</div>
                      <div>213</div>
                      <div>1.065</div>
                      <div>243</div>
                      <div>1.215</div>
                    </li>
                    <li>
                      <div>55</div>
                      <div>215</div>
                      <div>1.075</div>
                      <div>245</div>
                      <div>1.225</div>
                    </li>
                    <li>
                      <div>56</div>
                      <div>218</div>
                      <div>1.09</div>
                      <div>248</div>
                      <div>1.24</div>
                    </li>
                    <li>
                      <div>57</div>
                      <div>221</div>
                      <div>1.105</div>
                      <div>251</div>
                      <div>1.255</div>
                    </li>
                    <li>
                      <div>58</div>
                      <div>224</div>
                      <div>1.12</div>
                      <div>254</div>
                      <div>1.27</div>
                    </li>
                    <li>
                      <div>59</div>
                      <div>227</div>
                      <div>1.135</div>
                      <div>257</div>
                      <div>1.285</div>
                    </li>
                    <li>
                      <div>60</div>
                      <div>230</div>
                      <div>1.15</div>
                      <div>260</div>
                      <div>1.3</div>
                    </li>
                    <li>
                      <div>61</div>
                      <div>233</div>
                      <div>1.165</div>
                      <div>263</div>
                      <div>1.315</div>
                    </li>
                    <li>
                      <div>62</div>
                      <div>236</div>
                      <div>1.18</div>
                      <div>266</div>
                      <div>1.33</div>
                    </li>
                    <li>
                      <div>63</div>
                      <div>239</div>
                      <div>1.195</div>
                      <div>269</div>
                      <div>1.345</div>
                    </li>
                    <li>
                      <div>64</div>
                      <div>242</div>
                      <div>1.21</div>
                      <div>272</div>
                      <div>1.36</div>
                    </li>
                    <li>
                      <div>65</div>
                      <div>245</div>
                      <div>1.225</div>
                      <div>275</div>
                      <div>1.375</div>
                    </li>
                    <li>
                      <div>66</div>
                      <div>248</div>
                      <div>1.24</div>
                      <div>278</div>
                      <div>1.39</div>
                    </li>
                    <li>
                      <div>67</div>
                      <div>251</div>
                      <div>1.255</div>
                      <div>281</div>
                      <div>1.405</div>
                    </li>
                    <li>
                      <div>68</div>
                      <div>254</div>
                      <div>1.27</div>
                      <div>284</div>
                      <div>1.42</div>
                    </li>
                    <li>
                      <div>69</div>
                      <div>257</div>
                      <div>1.285</div>
                      <div>287</div>
                      <div>1.435</div>
                    </li>
                    <li>
                      <div>70</div>
                      <div>260</div>
                      <div>1.3</div>
                      <div>290</div>
                      <div>1.45</div>
                    </li>
                    <li>
                      <div>71</div>
                      <div>263</div>
                      <div>1.315</div>
                      <div>293</div>
                      <div>1.465</div>
                    </li>
                    <li>
                      <div>72</div>
                      <div>266</div>
                      <div>1.33</div>
                      <div>296</div>
                      <div>1.48</div>
                    </li>
                    <li>
                      <div>73</div>
                      <div>269</div>
                      <div>1.345</div>
                      <div>299</div>
                      <div>1.495</div>
                    </li>
                    <li>
                      <div>74</div>
                      <div>272</div>
                      <div>1.36</div>
                      <div>302</div>
                      <div>1.51</div>
                    </li>
                    <li>
                      <div>75</div>
                      <div>275</div>
                      <div>1.375</div>
                      <div>305</div>
                      <div>1.525</div>
                    </li>
                    <li>
                      <div>76</div>
                      <div>278</div>
                      <div>1.39</div>
                      <div>308</div>
                      <div>1.54</div>
                    </li>
                    <li>
                      <div>77</div>
                      <div>281</div>
                      <div>1.405</div>
                      <div>311</div>
                      <div>1.555</div>
                    </li>
                    <li>
                      <div>78</div>
                      <div>284</div>
                      <div>1.42</div>
                      <div>314</div>
                      <div>1.57</div>
                    </li>
                    <li>
                      <div>79</div>
                      <div>287</div>
                      <div>1.435</div>
                      <div>317</div>
                      <div>1.585</div>
                    </li>
                    <li>
                      <div>80</div>
                      <div>290</div>
                      <div>1.45</div>
                      <div>320</div>
                      <div>1.6</div>
                    </li>
                  </ul>
                </div>
              </details>
            </li>
          </ul>
        </div>
        {/* Master category */}
        <div className="column-right">
          <h3>Youth Category</h3>
          <ul>
            <li>
              <details>
                <summary>Forming a team</summary>
                <div>Each team must have no more than 24 runners.</div>
                <div>Each runner can only run for one team.</div>
                <div>
                  Each runner must be 10 years of age or older, and younger than
                  18.
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Competition rules</summary>
                <div>
                  Members of the relay team can run multiple legs, and the team
                  must run a total of 4 hours continuously.
                </div>
                <div>
                  The team that covers the longest distance wins the race.
                </div>
                <div>
                  Each leg of the relay must be no less than 10 minutes, and no
                  more than 60 minutes.
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>​​Calculating the final result of a team</summary>
                <div>
                  Each team must calculate the weighted coefficient of the team,
                  which is based on each member’s age, gender, and running time
                  entered on the regisliation form. The team’s weighted
                  coefficient must be reported the day before the race. The
                  team’s distance for record-keeping in determining the winner
                  is calculated as the actual distance covered in the relay by
                  the team and its weighted coefficient.
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Calculating the weighted coefficient</summary>
                <div>
                  <div className="table-name">Coefficient Table</div>
                  <ul className="coefficient-table mt-5">
                    <li className="table-header">
                      <div>Age</div>
                      <div>Male Marathon BQ Time (min)</div>
                      <div>Male Coefficient</div>
                      <div>Female Marathon BQ Time (min)</div>
                      <div>Female Coefficient</div>
                    </li>
                    <li>
                      <div>10</div>
                      <div>240</div>
                      <div>1.2</div>
                      <div>280</div>
                      <div>1.4</div>
                    </li>
                    <li>
                      <div>11</div>
                      <div>220</div>
                      <div>1.1</div>
                      <div>260</div>
                      <div>1.3</div>
                    </li>
                    <li>
                      <div>12</div>
                      <div>210</div>
                      <div>1.05</div>
                      <div>248</div>
                      <div>1.24</div>
                    </li>
                    <li>
                      <div>13</div>
                      <div>200</div>
                      <div>1</div>
                      <div>238</div>
                      <div>1.19</div>
                    </li>
                    <li>
                      <div>14</div>
                      <div>192</div>
                      <div>0.96</div>
                      <div>230</div>
                      <div>1.15</div>
                    </li>
                    <li>
                      <div>15</div>
                      <div>187</div>
                      <div>0.935</div>
                      <div>225</div>
                      <div>1.125</div>
                    </li>
                    <li>
                      <div>16</div>
                      <div>184</div>
                      <div>0.92</div>
                      <div>220</div>
                      <div>1.1</div>
                    </li>
                    <li>
                      <div>17</div>
                      <div>182</div>
                      <div>0.91</div>
                      <div>215</div>
                      <div>1.075</div>
                    </li>
                  </ul>
                </div>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
