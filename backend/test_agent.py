# from langchain_core.messages import HumanMessage
from langchain_core.messages import HumanMessage , AIMessage

from app.agents.graph import graph

state = {
    "tenant_id": "83984207-48dd-453f-9fb7-cb7f18bf82e3",
    "messages": [
        HumanMessage(content="What is the refund policy?"),
        AIMessage(content="Customers can request a refund within 7 days."),
        HumanMessage(content="What about password reset?")
    ]
}
result = graph.invoke(state)

print(result)