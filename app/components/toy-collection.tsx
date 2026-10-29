import { assetPaths, toyFriends } from "../content/site-content";

export function ToyCollection() {
  return (
    <section className="toy-section" id="toys">
      <div className="toy-heading">
        <span>01 / DOLL COLLECTION</span>
        <div><h2>YUY 是主角</h2><p>最喜欢的放在最中间，其他可爱朋友排排坐。</p></div>
      </div>

      <div className="toy-stage">
        <article className="toy-main">
          <img src={assetPaths.yuyFlower} alt="小玉 YUY 花朵主题原作插画" />
          <div><span>ABSOLUTE FAVORITE</span><h3>小玉 YUY</h3><p>收藏架的中心位，当然要留给它。</p></div>
          <b>★ NO.1</b>
        </article>

        <div className="toy-friends" aria-label="其他喜欢的卡通玩偶">
          {toyFriends.map((friend) => (
            <figure key={friend.name}>
              <img src={friend.image} alt={friend.alt} />
              <figcaption>{friend.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
