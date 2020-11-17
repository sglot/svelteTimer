# Svelte Timer
Данный проект представляет собой маленькое легковесное приложение написанное на Svelte.

## Хронология:
### Первый релиз:
    - Приложение работает, код читается тяжело

### Второй релиз:
    - Приложение не претерпело коренных изменений 
    - Код был подчищен, распределён по новым файлам
    - Добавлен компонент настроек с сохранением/загрузкой конфигурации настраиваемых параметров таймера. 
    - Хранение в local storage
    - Svelte отлично поддерживает type script. Код стал легче читаться, увеличилась безопасность.
    - На данном этапе всем возможностям Svelte и мощи системы типов TS применения не нашлось. 
    - Время выводилось корректно только до 60 минут. Часы не учитывались. Максимальное время стало 77 минут