# Панель звонков

### [Посмотреть проект в один клик](https://webbOrista.github.io/calls-panel/)


## Стек
- **React**
- **JavaScript**
- **HTML**
- **CSS**


## Функциональность

- отображение списка звонков с выборкой по датам 
- фильтрация звонков по типу: входящие, исходящие или все звонки
- проигрывание записи звонка
- возможность сбросить все примененнные фильтры


## Структура

Проект разделен на 6 компонентов:

- **TopBar** — компонент, расположенный над таблицей и содержащий фильтры
- **CallTypeDropdown** — компонент фильтрации звонков по типу
- **DateDropdown** — компонент фильтрации звонков по датам
- **CallTable** — таблица звонков
- **CallRow** — компонент таблицы отображающий данные о конкретном звонке
- **PlayBar** — проигрыватель записей звонков

Все компоненты приложения организованы в рамках компонента App.
