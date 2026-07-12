from langgraph.graph import MessagesState


class SupportState(MessagesState):
    """
    Custom state for SupportOS AI.
    """

    context: str = ""
    answer: str = ""