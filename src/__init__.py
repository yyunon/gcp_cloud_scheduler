from google.cloud import logging

def main():
	client = logging.Client()
	log_name = "TEST"
	logger = client.logger(log_name)
	logger.log_text("Hello world")
	print("hello world")

if __name__ == "__main__":
	main()