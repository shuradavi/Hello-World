async function getData(url = './data.json') {
  try {
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.warn('Error >>>', error);
  }
}
// getData();
// const divWork = document.querySelector(
//   '.dashboard__item-work .tracking-card__header .tracking-card__title'
// );

// 1 Card:
// Создаем класс с карточкой
class DashboardItem {
  static PERIODS = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
  };

  constructor(data, container = '.dashboard__content', view = 'weekly') {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;

    this.createMarkUp();
  }
  // создаем разметку
  createMarkUp() {
    const { title, timeframes } = this.data;
    const id = title.toLowerCase().replace(/ /g, '-');
    const { current, previous } = timeframes[this.view.toLowerCase()];
    this.container.insertAdjacentHTML(
      'beforeend',
      `
      <div class="dashboard__item dashboard__item-${id}">
      <article class="tracking-card">
        <header class="tracking-card__header">
          <h4 class="tracking-card__title">${title}</h4>
          <img
            class="tracking-card__menu"
            src="images/icon-ellipsis.svg"
            alt="menu"
          />
        </header>
        <div class="tracking-card__body">
          <div class="tracking-card__time">${current}hrs</div>
          <div class="tracking-card__prev">Last ${
            DashboardItem.PERIODS[this.view]
          } ${previous}hrs</div>
        </div>
      </article>
    </div>
    `
    );
    this.time = this.container.querySelector(
      `.dashboard__item-${id} .tracking-card__time`
    );
    this.prev = this.container.querySelector(
      `.dashboard__item-${id} .tracking-card__prev`
    );
  }

  changeView(view) {
    try {
      this.view = view.toLowerCase();
      const { current, previous } = this.data.timeframes[this.view];
      this.time.innerText = `${current}hrs`;
      this.prev.innerText = `Last ${
        DashboardItem.PERIODS[this.view]
      } ${previous}hrs`;
    } catch (error) {
      console.warn(error);
      // console.log(this.view);
      // console.log('Current', current);
      // console.log('Prev', previous);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getData()
    .then((data) => {
      const activities = data.map((activity) => new DashboardItem(activity));
      const selectors = document.querySelectorAll('.person__selector__item');
      selectors.forEach((selector) =>
        selector.addEventListener('click', function () {
          selectors.forEach((sel) => {
            sel.classList.remove('person__selector__item__active');
          });
          selector.classList.add('person__selector__item__active');
          const currentView = selector.innerText.trim().toLowerCase();
          activities.forEach((activity) => {
            activity.changeView(currentView);
          });
        })
      );
    })
    .catch((error) => console.warn(error));
});
