// @ts-check

/* global customElements */
/* global HTMLElement */

/**
 * https://github.com/Weedshaker/event-driven-web-components-realworld-example-app/blob/master/FRONTEND_INSTRUCTIONS.md#article
 * As a molecule, this component shall hold Atoms
 * this organism always renders new when connected to keep most recent and does not need shouldComponentRender
 *
 * @export
 * @class Article
 */
export default class Article extends HTMLElement {
  constructor () {
    super()

    /**
     * Listens to the event name/typeArg: 'getArticle'
     *
     * @param {CustomEvent & {detail: import("../controllers/GetArticle.js").GetArticleEventDetail}} event
     */
    this.getArticleListener = event => this.render(event.detail.fetch)
  }

  connectedCallback () {
    // listen for articles
    document.body.addEventListener('getArticle', this.getArticleListener)
    // on every connect it will attempt to get newest articles
    this.dispatchEvent(new CustomEvent('requestGetArticle', {
      /** @type {import("../controllers/GetArticle.js").RequestGetArticleEventDetail} */
      detail: {}, // slug gets decided at GetArticle.js controller, could also be done by request event to router
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }

  disconnectedCallback () {
    document.body.removeEventListener('getArticle', this.getArticleListener)
  }

  /**
   * renders the article
   *
   * @param {Promise<{article: import("../../helpers/Interfaces.js").SingleArticle}>} fetchSingleArticle
   * @return {void}
   */
  render (fetchSingleArticle) {
    fetchSingleArticle.then(result => {
      const article = result.article
      if (!article.author || !article.tagList) return this.innerHTML = '<div class="article-page">An error occurred rendering the article-page!</div>'
      this.innerHTML = `
        <div class="article-page">

          <div class="banner">
            <div class="container">
        
              <h1>How to build webapps that scale</h1>
        
              <div class="article-meta"></div>
        
            </div>
          </div>
        
          <div class="container page">
        
            <div class="row article-content">
              <div class="col-md-12">
                <p>
                Web development technologies have evolved at an incredible clip over the past few years.
                </p>
                <h2 id="introducing-ionic">Introducing RealWorld.</h2>
                <p>It's a great solution for learning how other frameworks work.</p>
              </div>
            </div>
        
            <hr />
        
            <div class="article-actions">
              <div class="article-meta">
                <a href="profile.html"><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
                <div class="info">
                  <a href="" class="author">Eric Simons</a>
                  <span class="date">January 20th</span>
                </div>
        
                <button class="btn btn-sm btn-outline-secondary">
                  <i class="ion-plus-round"></i>
                  &nbsp;
                  Follow Eric Simons <span class="counter">(10)</span>
                </button>
                &nbsp;
                <button class="btn btn-sm btn-outline-primary">
                  <i class="ion-heart"></i>
                  &nbsp;
                  Favorite Post <span class="counter">(29)</span>
                </button>
              </div>
            </div>
        
            <div class="row">
        
              <div class="col-xs-12 col-md-8 offset-md-2">
        
                <form class="card comment-form">
                  <div class="card-block">
                    <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
                  </div>
                  <div class="card-footer">
                    <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                    <button class="btn btn-sm btn-primary">
                    Post Comment
                    </button>
                  </div>
                </form>
                
                <div class="card">
                  <div class="card-block">
                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  </div>
                  <div class="card-footer">
                    <a href="" class="comment-author">
                      <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                    </a>
                    &nbsp;
                    <a href="" class="comment-author">Jacob Schmidt</a>
                    <span class="date-posted">Dec 29th</span>
                  </div>
                </div>
        
                <div class="card">
                  <div class="card-block">
                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  </div>
                  <div class="card-footer">
                    <a href="" class="comment-author">
                      <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                    </a>
                    &nbsp;
                    <a href="" class="comment-author">Jacob Schmidt</a>
                    <span class="date-posted">Dec 29th</span>
                    <span class="mod-options">
                      <i class="ion-edit"></i>
                      <i class="ion-trash-a"></i>
                    </span>
                  </div>
                </div>
                
              </div>
        
            </div>
        
          </div>
        
        </div>
      `
      this.loadChildComponents().then(children => {
        /** @type {import("../atoms/ArticleMeta.js").default} */
        // @ts-ignore
        const articleMeta = new children[0][1](article)
        this.querySelector('.article-meta').replaceWith(articleMeta)
      })
    // @ts-ignore
    }).catch(error => (this.innerHTML = console.warn(error) || '<div class="article-page">An error occurred fetching the article!</div>'))
  }

  /**
   * fetch children when first needed
   *
   * @returns {Promise<[string, CustomElementConstructor][]>}
   */
  loadChildComponents () {
    return this.childComponentsPromise || (this.childComponentsPromise = Promise.all([
      import('../atoms/ArticleMeta.js').then(
        /** @returns {[string, CustomElementConstructor]} */
        module => ['a-article-meta', module.default]
      )
    ]).then(elements => {
      elements.forEach(element => {
        // don't define already existing customElements
        // @ts-ignore
        if (!customElements.get(element[0])) customElements.define(...element)
      })
      return elements
    }))
  }
}