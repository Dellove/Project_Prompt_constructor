from langchain_community.llms import Ollama
import sys
import json


def Generate_prompt(text):
    llm = Ollama(model="llama2")
    preprompt='You need to generate a prompt that should reflect your character, skills, limitations, presentation form. Generate on the following topic:'
    return llm.invoke(preprompt+text)

if __name__ == "__main__":
    text = ' '.join(sys.argv[1:])
    analysis_results = Generate_prompt(text)
    print(json.dumps(analysis_results, ensure_ascii=False))