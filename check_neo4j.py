from neo4j import GraphDatabase
import os

NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

def check_neo4j():
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        with driver.session() as session:
            result = session.run("RETURN 1")
            print(f"Neo4j Connection Successful: {result.single()[0]}")
        driver.close()
    except Exception as e:
        print(f"Neo4j Connection Failed: {str(e)}")

if __name__ == "__main__":
    check_neo4j()
