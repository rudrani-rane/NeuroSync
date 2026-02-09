from neo4j import GraphDatabase
import os

uri = "bolt://127.0.0.1:7687"
user = "neo4j"
password = "password"

def check_neo4j():
    try:
        driver = GraphDatabase.driver(uri, auth=(user, password))
        with driver.session() as session:
            result = session.run("RETURN 1 as result")
            record = result.single()
            if record["result"] == 1:
                print("Neo4j is UP and reachable.")
            else:
                print("Neo4j returned unexpected result.")
        driver.close()
    except Exception as e:
        print(f"Error connecting to Neo4j: {str(e)}")

if __name__ == "__main__":
    check_neo4j()
