import './Instruction.css';

export const Instruction = () => {
    return (
      <div className="instruction">
        <h2>Инструкция по использованию промпт-генератора:</h2>
        <ol>
          <li>
            <strong>Введите запрос:</strong> Введите ваш запрос в поле ввода "Введите запрос". Это может быть любая фраза или вопрос, который вы хотите задать модели, чтобы получить промпт на заданную тему.
          </li>
          <li>
            <strong>Выберите роль:</strong> Выберите роль из выпадающего списка "Роль". Каждая роль представляет собой определенный стиль или характер запроса, который влияет на структуру и содержание сгенерированного промпта.
            <ul>
              <li><strong>Серёга:</strong> Обычный, неспецифицированный запрос.</li>
              <li><strong>Сергей:</strong> Творческий запрос, требующий креативного подхода.</li>
              <li><strong>Серый:</strong> Технический запрос, требующий точности и специализированных знаний.</li>
            </ul>
          </li>
          <li>
            <strong>Настройте температуру:</strong> Используйте ползунок "Температура", чтобы управлять степенью "смелости" генерации промпта. Низкие значения температуры предпочтительны для более консервативных результатов, в то время как более высокие значения могут привести к более экспериментальным и неожиданным промптам.
          </li>
          <li>
            <strong>Сгенерируйте промпт:</strong> Нажмите кнопку "Сгенерировать промпт", чтобы создать промпт на основе введенных вами данных. Это запустит процесс генерации и отобразит сгенерированный промпт в соответствующем поле ниже.
          </li>
          <li>
            <strong>Скопируйте промпт:</strong> После генерации промпта вы можете скопировать его, нажав кнопку "Скопировать промпт". Это поместит текст промпта в ваш буфер обмена, готовый к использованию в вашем проекте или задаче.
          </li>
        </ol>
      </div>
    );
  };